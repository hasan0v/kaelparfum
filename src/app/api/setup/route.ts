import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// This route is for initial setup only - should be disabled in production
export async function POST(request: Request) {
    try {
        const { email, password, secretKey } = await request.json();

        // Simple security check - you should remove this route after setup
        if (secretKey !== 'KAEL_SETUP_2024') {
            return NextResponse.json(
                { success: false, error: 'Invalid secret key' },
                { status: 401 }
            );
        }

        const supabase = await createAdminClient();

        // Create user with Supabase Admin API
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json(
                { success: false, error: authError.message },
                { status: 400 }
            );
        }

        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update profile to admin role
        const { error: profileError } = await supabase
            .from('profiles')
            // @ts-ignore
            .update({ role: 'admin', full_name: 'Admin' })
            .eq('id', authData.user.id);

        if (profileError) {
            console.error('Profile error:', profileError);
            // Profile might not exist if trigger didn't run, try inserting
            // @ts-ignore
            await supabase.from('profiles').insert({
                id: authData.user.id,
                role: 'admin',
                full_name: 'Admin',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            userId: authData.user.id,
            email: authData.user.email,
        });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json(
            { success: false, error: 'Setup failed' },
            { status: 500 }
        );
    }
}
