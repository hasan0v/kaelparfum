'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

interface CategoryData {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    is_active?: boolean;
    display_order?: number;
}

export async function createCategory(data: CategoryData) {
    try {
        const supabase = await createAdminClient();

        const { data: category, error } = await supabase
            .from('categories')
            .insert({
                ...data,
                is_active: data.is_active ?? true,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating category:', error);
            if (error.code === '23505') {
                return { success: false, error: 'Bu adda və ya slug-da kateqoriya artıq mövcuddur' };
            }
            return { success: false, error: 'Kateqoriya yaradılarkən xəta baş verdi' };
        }

        revalidatePath('/admin/kateqoriyalar');
        revalidatePath('/mehsullar');

        return { success: true, id: category.id };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: 'Kateqoriya yaradılarkən xəta baş verdi' };
    }
}

export async function updateCategory(id: string, data: Partial<CategoryData>) {
    try {
        const supabase = await createAdminClient();

        const { error } = await supabase
            .from('categories')
            .update(data)
            .eq('id', id);

        if (error) {
            console.error('Error updating category:', error);
            if (error.code === '23505') {
                return { success: false, error: 'Bu adda və ya slug-da kateqoriya artıq mövcuddur' };
            }
            return { success: false, error: 'Kateqoriya yenilənərkən xəta baş verdi' };
        }

        revalidatePath('/admin/kateqoriyalar');
        revalidatePath('/mehsullar');

        return { success: true };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: 'Kateqoriya yenilənərkən xəta baş verdi' };
    }
}

export async function deleteCategory(id: string) {
    try {
        const supabase = await createAdminClient();

        // Check if category has products
        const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', id);

        if (countError) {
            console.error('Error checking products:', countError);
            return { success: false, error: 'Xəta baş verdi' };
        }

        if (count && count > 0) {
            return { success: false, error: 'Bu kateqoriyada məhsullar var. Əvvəlcə məhsulları silin və ya başqa kateqoriyaya keçirin.' };
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            return { success: false, error: 'Kateqoriya silinərkən xəta baş verdi' };
        }

        revalidatePath('/admin/kateqoriyalar');
        revalidatePath('/mehsullar');

        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: 'Kateqoriya silinərkən xəta baş verdi' };
    }
}

export async function getCategories(options?: {
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
            .from('categories')
            .select('*', { count: 'exact' })
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (options?.search) {
            query = query.ilike('name', `%${options.search}%`);
        }

        if (options?.isActive !== undefined) {
            query = query.eq('is_active', options.isActive);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching categories:', error);
            return { success: false, categories: [], total: 0, error: 'Kateqoriyalar yüklənərkən xəta baş verdi' };
        }

        return {
            success: true,
            categories: data || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, categories: [], total: 0, error: 'Kateqoriyalar yüklənərkən xəta baş verdi' };
    }
}

export async function getCategoryById(id: string) {
    try {
        const supabase = await createAdminClient();

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching category:', error);
            return { success: false, category: null, error: 'Kateqoriya tapılmadı' };
        }

        return { success: true, category: data };
    } catch (error) {
        console.error('Error fetching category:', error);
        return { success: false, category: null, error: 'Kateqoriya yüklənərkən xəta baş verdi' };
    }
}
