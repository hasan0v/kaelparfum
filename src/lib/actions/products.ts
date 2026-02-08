'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteProductImages } from './images';

interface ProductData {
    id?: string;
    name: string;
    slug: string;
    sku: string;
    description?: string;
    short_description?: string;
    price: number;
    discount_price?: number | null;
    stock_quantity: number;
    low_stock_threshold?: number;
    category_id: string;
    brand_id: string;
    is_active?: boolean;
    is_featured?: boolean;
    is_new?: boolean;
}

export async function createProduct(data: ProductData) {
    try {
        const supabase = await createAdminClient();

        const { data: product, error } = await supabase
            .from('products')
            .insert({
                ...data,
                is_active: data.is_active ?? true,
                is_featured: data.is_featured ?? false,
                is_new: data.is_new ?? true,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating product:', error);
            return { success: false, error: 'Məhsul yaradılarkən xəta baş verdi' };
        }

        revalidatePath('/admin/mehsullar');
        revalidatePath('/mehsullar');

        return { success: true, id: product.id };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Məhsul yaradılarkən xəta baş verdi' };
    }
}

export async function updateProduct(id: string, data: Partial<ProductData>) {
    try {
        const supabase = await createAdminClient();

        const { error } = await supabase
            .from('products')
            .update(data)
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error);
            return { success: false, error: 'Məhsul yenilənərkən xəta baş verdi' };
        }

        revalidatePath('/admin/mehsullar');
        revalidatePath('/mehsullar');
        revalidatePath(`/mehsullar/${data.slug}`);

        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Məhsul yenilənərkən xəta baş verdi' };
    }
}

export async function deleteProduct(id: string) {
    try {
        const supabase = await createAdminClient();

        // First delete all images from storage
        await deleteProductImages(id);

        // Then delete the product (cascade will delete product_images records)
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return { success: false, error: 'Məhsul silinərkən xəta baş verdi' };
        }

        revalidatePath('/admin/mehsullar');
        revalidatePath('/mehsullar');

        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Məhsul silinərkən xəta baş verdi' };
    }
}

export async function getProducts(options?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
    status?: 'active' | 'draft' | 'out_of_stock';
}) {
    try {
        const supabase = await createAdminClient();
        const page = options?.page || 1;
        const limit = options?.limit || 20;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('products')
            .select(`
        *,
        category:categories(id, name),
        brand:brands(id, name),
        images:product_images(id, image_url, is_primary)
      `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (options?.search) {
            query = query.ilike('name', `%${options.search}%`);
        }

        if (options?.categoryId) {
            query = query.eq('category_id', options.categoryId);
        }

        if (options?.brandId) {
            query = query.eq('brand_id', options.brandId);
        }

        if (options?.status === 'active') {
            query = query.eq('is_active', true).gt('stock_quantity', 0);
        } else if (options?.status === 'draft') {
            query = query.eq('is_active', false);
        } else if (options?.status === 'out_of_stock') {
            query = query.eq('stock_quantity', 0);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            return { success: false, products: [], total: 0, error: 'Məhsullar yüklənərkən xəta baş verdi' };
        }

        return {
            success: true,
            products: data || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, products: [], total: 0, error: 'Məhsullar yüklənərkən xəta baş verdi' };
    }
}

export async function getProductById(id: string) {
    try {
        const supabase = await createAdminClient();

        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        category:categories(id, name),
        brand:brands(id, name),
        images:product_images(id, image_url, alt_text, is_primary, display_order),
        variants:product_variants(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            return { success: false, product: null, error: 'Məhsul tapılmadı' };
        }

        return { success: true, product: data };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, product: null, error: 'Məhsul yüklənərkən xəta baş verdi' };
    }
}

export async function getCategories() {
    try {
        const supabase = await createAdminClient();

        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return { success: false, categories: [] };
        }

        return { success: true, categories: data || [] };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, categories: [] };
    }
}

export async function getBrands() {
    try {
        const supabase = await createAdminClient();

        const { data, error } = await supabase
            .from('brands')
            .select('id, name, slug')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching brands:', error);
            return { success: false, brands: [] };
        }

        return { success: true, brands: data || [] };
    } catch (error) {
        console.error('Error fetching brands:', error);
        return { success: false, brands: [] };
    }
}
