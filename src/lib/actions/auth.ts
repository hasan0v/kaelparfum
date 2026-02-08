'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: 'E-poçt və ya şifrə yanlışdır' };
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    revalidatePath('/', 'layout');

    if (profile?.role === 'admin') {
        redirect('/admin');
    }

    redirect('/hesabim');
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone: phone,
            },
        },
    });

    if (error) {
        return { success: false, error: 'Qeydiyyat zamanı xəta baş verdi' };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function getSession() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    return { ...user, profile };
}

export async function isAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    return profile?.role === 'admin';
}

// Create admin user (for initial setup - run once)
export async function createAdminUser(email: string, password: string) {
    const supabase = await createAdminClient();

    // Create user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (authError) {
        console.error('Error creating admin user:', authError);
        return { success: false, error: authError.message };
    }

    // Update profile to admin role
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id);

    if (profileError) {
        console.error('Error updating profile:', profileError);
        return { success: false, error: profileError.message };
    }

    return { success: true, userId: authData.user.id };
}
