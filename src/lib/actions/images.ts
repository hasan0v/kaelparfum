'use server';

import sharp from 'sharp';
import { createAdminClient } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';

// Constants
const STORAGE_BUCKET = 'product-images';
const MAX_WIDTH = 1200;
const QUALITY = 80;

interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
    path?: string;
}

interface DeleteResult {
    success: boolean;
    error?: string;
}

/**
 * Convert image buffer to WebP format
 */
async function convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .resize(MAX_WIDTH, MAX_WIDTH, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toBuffer();
}

/**
 * Upload a single image to Supabase Storage
 * Converts to WebP format before uploading
 */
export async function uploadProductImage(
    formData: FormData
): Promise<UploadResult> {
    try {
        const file = formData.get('file') as File;
        const productId = formData.get('productId') as string;

        if (!file) {
            return { success: false, error: 'Fayl seçilməyib' };
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: 'Yalnız şəkil faylları yüklənə bilər (JPG, PNG, WebP, GIF)' };
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return { success: false, error: 'Fayl ölçüsü 10MB-dan böyük ola bilməz' };
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert to WebP
        const webpBuffer = await convertToWebP(buffer);

        // Generate unique filename
        const filename = `${productId || 'temp'}/${uuidv4()}.webp`;

        // Get Supabase admin client
        const supabase = await createAdminClient();

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filename, webpBuffer, {
                contentType: 'image/webp',
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            return { success: false, error: 'Şəkil yüklənərkən xəta baş verdi' };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path);

        return {
            success: true,
            url: publicUrl,
            path: data.path,
        };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Şəkil yüklənərkən xəta baş verdi' };
    }
}

/**
 * Upload multiple images for a product
 */
export async function uploadMultipleImages(
    formData: FormData
): Promise<{ success: boolean; results: UploadResult[]; error?: string }> {
    try {
        const files = formData.getAll('files') as File[];
        const productId = formData.get('productId') as string;

        if (!files || files.length === 0) {
            return { success: false, results: [], error: 'Fayl seçilməyib' };
        }

        const results: UploadResult[] = [];

        for (const file of files) {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('productId', productId);

            const result = await uploadProductImage(fd);
            results.push(result);
        }

        const allSuccessful = results.every(r => r.success);

        return {
            success: allSuccessful,
            results,
            error: allSuccessful ? undefined : 'Bəzi şəkillər yüklənmədi',
        };
    } catch (error) {
        console.error('Multiple upload error:', error);
        return { success: false, results: [], error: 'Şəkillər yüklənərkən xəta baş verdi' };
    }
}

/**
 * Delete a single image from Supabase Storage
 */
export async function deleteProductImage(
    imagePath: string
): Promise<DeleteResult> {
    try {
        const supabase = await createAdminClient();

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([imagePath]);

        if (error) {
            console.error('Delete error:', error);
            return { success: false, error: 'Şəkil silinərkən xəta baş verdi' };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Şəkil silinərkən xəta baş verdi' };
    }
}

/**
 * Delete all images for a product
 */
export async function deleteProductImages(
    productId: string
): Promise<DeleteResult> {
    try {
        const supabase = await createAdminClient();

        // List all files in the product folder
        const { data: files, error: listError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list(productId);

        if (listError) {
            console.error('List error:', listError);
            return { success: false, error: 'Şəkillər siyahısı alınarkən xəta baş verdi' };
        }

        if (!files || files.length === 0) {
            return { success: true }; // No images to delete
        }

        // Delete all files
        const filePaths = files.map(file => `${productId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove(filePaths);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return { success: false, error: 'Şəkillər silinərkən xəta baş verdi' };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Şəkillər silinərkən xəta baş verdi' };
    }
}

/**
 * Save image record to database
 */
export async function saveProductImageRecord(
    productId: string,
    imageUrl: string,
    altText?: string,
    isPrimary: boolean = false,
    displayOrder: number = 0
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const supabase = await createAdminClient();

        // If this is primary, unset other primary images
        if (isPrimary) {
            await supabase
                .from('product_images')
                .update({ is_primary: false })
                .eq('product_id', productId);
        }

        const { data, error } = await supabase
            .from('product_images')
            .insert({
                product_id: productId,
                image_url: imageUrl,
                alt_text: altText,
                is_primary: isPrimary,
                display_order: displayOrder,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Database error:', error);
            return { success: false, error: 'Şəkil bazaya yazılarkən xəta baş verdi' };
        }

        return { success: true, id: data.id };
    } catch (error) {
        console.error('Database error:', error);
        return { success: false, error: 'Şəkil bazaya yazılarkən xəta baş verdi' };
    }
}

/**
 * Delete image record from database
 */
export async function deleteProductImageRecord(
    imageId: string
): Promise<DeleteResult> {
    try {
        const supabase = await createAdminClient();

        // First get the image URL to delete from storage
        const { data: image, error: fetchError } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('id', imageId)
            .single();

        if (fetchError) {
            console.error('Fetch error:', fetchError);
            return { success: false, error: 'Şəkil tapılmadı' };
        }

        // Extract path from URL
        const url = new URL(image.image_url);
        const pathParts = url.pathname.split('/');
        const storagePath = pathParts.slice(-2).join('/'); // productId/filename.webp

        // Delete from storage
        await deleteProductImage(storagePath);

        // Delete from database
        const { error: deleteError } = await supabase
            .from('product_images')
            .delete()
            .eq('id', imageId);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return { success: false, error: 'Şəkil silinərkən xəta baş verdi' };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Şəkil silinərkən xəta baş verdi' };
    }
}

/**
 * Delete product with all its images
 */
export async function deleteProductWithImages(
    productId: string
): Promise<DeleteResult> {
    try {
        const supabase = await createAdminClient();

        // Delete all images from storage
        await deleteProductImages(productId);

        // Delete product (cascade will delete product_images records)
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) {
            console.error('Delete error:', error);
            return { success: false, error: 'Məhsul silinərkən xəta baş verdi' };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Məhsul silinərkən xəta baş verdi' };
    }
}
