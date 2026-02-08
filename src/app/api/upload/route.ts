import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { createAdminClient } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'product-images';
const MAX_WIDTH = 1200;
const QUALITY = 80;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const productId = formData.get('productId') as string;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'Fayl seçilməyib' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Yalnız şəkil faylları yüklənə bilər' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert to WebP using sharp
        const webpBuffer = await sharp(buffer)
            .resize(MAX_WIDTH, MAX_WIDTH, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: QUALITY })
            .toBuffer();

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
            return NextResponse.json(
                { success: false, error: 'Şəkil yüklənərkən xəta baş verdi' },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            path: data.path,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, error: 'Şəkil yüklənərkən xəta baş verdi' },
            { status: 500 }
        );
    }
}
