'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
    try {
        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (error) {
            console.error('Error fetching site settings:', error);
            return { success: false, settings: [], error: 'Parametrlər yüklənərkən xəta baş verdi' };
        }

        return { success: true, settings: data || [] };
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return { success: false, settings: [], error: 'Parametrlər yüklənərkən xəta baş verdi' };
    }
}

export async function updateSiteSettings(settings: { key: string; value: string }[]) {
    try {
        const supabase = await createAdminClient();

        // Update each setting
        const promises = settings.map(setting =>
            supabase
                .from('site_settings')
                .update({ value: setting.value, updated_at: new Date().toISOString() })
                .eq('key', setting.key)
        );

        const results = await Promise.all(promises);
        const hasError = results.some(res => res.error);

        if (hasError) {
            console.error('Error updating some site settings');
            return { success: false, error: 'Bəzi parametrlər yenilənmədi' };
        }

        revalidatePath('/admin/parametrler');
        revalidatePath('/', 'layout'); // For header/footer settings

        return { success: true, message: 'Parametrlər uğurla yeniləndi' };
    } catch (error) {
        console.error('Error updating site settings:', error);
        return { success: false, error: 'Parametrlər yenilənərkən xəta baş verdi' };
    }
}
