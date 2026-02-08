'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

interface BrandData {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    website?: string;
    logo_url?: string;
    is_active?: boolean;
}

export async function createBrand(data: BrandData) {
    try {
        const supabase = await createAdminClient();

        const { data: brand, error } = await supabase
            .from('brands')
            .insert({
                ...data,
                is_active: data.is_active ?? true,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating brand:', error);
            if (error.code === '23505') {
                return { success: false, error: 'Bu adda və ya slug-da brend artıq mövcuddur' };
            }
            return { success: false, error: 'Brend yaradılarkən xəta baş verdi' };
        }

        revalidatePath('/admin/brendler');
        revalidatePath('/mehsullar');

        return { success: true, id: brand.id };
    } catch (error) {
        console.error('Error creating brand:', error);
        return { success: false, error: 'Brend yaradılarkən xəta baş verdi' };
    }
}

export async function updateBrand(id: string, data: Partial<BrandData>) {
    try {
        const supabase = await createAdminClient();

        const { error } = await supabase
            .from('brands')
            .update(data)
            .eq('id', id);

        if (error) {
            console.error('Error updating brand:', error);
            if (error.code === '23505') {
                return { success: false, error: 'Bu adda və ya slug-da brend artıq mövcuddur' };
            }
            return { success: false, error: 'Brend yenilənərkən xəta baş verdi' };
        }

        revalidatePath('/admin/brendler');
        revalidatePath('/mehsullar');

        return { success: true };
    } catch (error) {
        console.error('Error updating brand:', error);
        return { success: false, error: 'Brend yenilənərkən xəta baş verdi' };
    }
}

export async function deleteBrand(id: string) {
    try {
        const supabase = await createAdminClient();

        // Check if brand has products
        const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('brand_id', id);

        if (countError) {
            console.error('Error checking products:', countError);
            return { success: false, error: 'Xəta baş verdi' };
        }

        if (count && count > 0) {
            return { success: false, error: 'Bu brendə aid məhsullar var. Əvvəlcə məhsulları silin və ya başqa brendə keçirin.' };
        }

        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting brand:', error);
            return { success: false, error: 'Brend silinərkən xəta baş verdi' };
        }

        revalidatePath('/admin/brendler');
        revalidatePath('/mehsullar');

        return { success: true };
    } catch (error) {
        console.error('Error deleting brand:', error);
        return { success: false, error: 'Brend silinərkən xəta baş verdi' };
    }
}

export async function getBrands(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}) {
    try {
        const supabase = await createAdminClient();
        const page = options?.page || 1;
        const limit = options?.limit || 20;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('brands')
            .select('*', { count: 'exact' })
            .order('name', { ascending: true })
            .range(offset, offset + limit - 1);

        if (options?.search) {
            query = query.ilike('name', `%${options.search}%`);
        }

        if (options?.isActive !== undefined) {
            query = query.eq('is_active', options.isActive);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching brands:', error);
            return { success: false, brands: [], total: 0, error: 'Brendlər yüklənərkən xəta baş verdi' };
        }

        return {
            success: true,
            brands: data || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        };
    } catch (error) {
        console.error('Error fetching brands:', error);
        return { success: false, brands: [], total: 0, error: 'Brendlər yüklənərkən xəta baş verdi' };
    }
}

export async function getBrandById(id: string) {
    try {
        const supabase = await createAdminClient();

        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching brand:', error);
            return { success: false, brand: null, error: 'Brend tapılmadı' };
        }

        return { success: true, brand: data };
    } catch (error) {
        console.error('Error fetching brand:', error);
        return { success: false, brand: null, error: 'Brend yüklənərkən xəta baş verdi' };
    }
}
