'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Star, Loader2, ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    uploadProductImage,
    deleteProductImageRecord,
    saveProductImageRecord
} from '@/lib/actions/images';

interface UploadedImage {
    id?: string;
    url: string;
    path?: string;
    isPrimary: boolean;
    isUploading?: boolean;
    error?: string;
}

interface ImageUploaderProps {
    productId: string;
    initialImages?: UploadedImage[];
    onImagesChange?: (images: UploadedImage[]) => void;
    maxImages?: number;
}

export default function ImageUploader({
    productId,
    initialImages = [],
    onImagesChange,
    maxImages = 10,
}: ImageUploaderProps) {
    const [images, setImages] = useState<UploadedImage[]>(initialImages);
    const [isUploading, setIsUploading] = useState(false);

    const updateImages = useCallback((newImages: UploadedImage[]) => {
        setImages(newImages);
        onImagesChange?.(newImages);
    }, [onImagesChange]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length > maxImages) {
            alert(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz`);
            return;
        }

        setIsUploading(true);

        for (const file of acceptedFiles) {
            // Add placeholder while uploading
            const tempId = `temp-${Date.now()}-${Math.random()}`;
            const tempImage: UploadedImage = {
                id: tempId,
                url: URL.createObjectURL(file),
                isPrimary: images.length === 0,
                isUploading: true,
            };

            setImages(prev => [...prev, tempImage]);

            // Upload the file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('productId', productId);

            const result = await uploadProductImage(formData);

            if (result.success && result.url) {
                // Save to database
                const dbResult = await saveProductImageRecord(
                    productId,
                    result.url,
                    file.name,
                    images.length === 0, // First image is primary
                    images.length
                );

                // Update the image in state
                setImages(prev =>
                    prev.map(img =>
                        img.id === tempId
                            ? {
                                id: dbResult.id,
                                url: result.url!,
                                path: result.path,
                                isPrimary: images.length === 0,
                                isUploading: false,
                            }
                            : img
                    )
                );
            } else {
                // Mark as error
                setImages(prev =>
                    prev.map(img =>
                        img.id === tempId
                            ? { ...img, isUploading: false, error: result.error }
                            : img
                    )
                );
            }
        }

        setIsUploading(false);
    }, [images, maxImages, productId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        disabled: isUploading,
    });

    const handleRemove = async (imageId: string) => {
        if (!imageId.startsWith('temp-')) {
            // Delete from database and storage
            const result = await deleteProductImageRecord(imageId);
            if (!result.success) {
                alert(result.error || 'Şəkil silinərkən xəta baş verdi');
                return;
            }
        }

        const newImages = images.filter(img => img.id !== imageId);

        // If we removed the primary image, make the first one primary
        if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
            newImages[0].isPrimary = true;
        }

        updateImages(newImages);
    };

    const handleSetPrimary = async (imageId: string) => {
        const newImages = images.map(img => ({
            ...img,
            isPrimary: img.id === imageId,
        }));
        updateImages(newImages);

        // TODO: Update in database
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                    isDragActive
                        ? 'border-kael-gold bg-kael-gold/5'
                        : 'border-kael-light-gray hover:border-kael-gold/50',
                    isUploading && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    {isUploading ? (
                        <Loader2 className="h-10 w-10 text-kael-gold animate-spin" />
                    ) : (
                        <Upload className="h-10 w-10 text-kael-gray" />
                    )}
                    <div>
                        <p className="font-medium text-kael-brown">
                            {isDragActive
                                ? 'Şəkilləri buraya buraxın'
                                : 'Şəkilləri sürükləyib buraxın və ya klikləyin'}
                        </p>
                        <p className="text-sm text-kael-gray mt-1">
                            JPG, PNG, WebP, GIF (maks. 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={image.id || `image-${index}`}
                            className={cn(
                                'relative aspect-square rounded-xl overflow-hidden border-2 group',
                                image.isPrimary ? 'border-kael-gold' : 'border-transparent',
                                image.error && 'border-kael-error'
                            )}
                        >
                            {/* Image */}
                            {image.isUploading ? (
                                <div className="w-full h-full bg-kael-cream flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-kael-gold animate-spin" />
                                </div>
                            ) : image.error ? (
                                <div className="w-full h-full bg-kael-error/10 flex flex-col items-center justify-center p-2">
                                    <AlertCircle className="h-8 w-8 text-kael-error mb-2" />
                                    <p className="text-xs text-kael-error text-center">{image.error}</p>
                                </div>
                            ) : (
                                <Image
                                    src={image.url}
                                    alt="Məhsul şəkli"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                />
                            )}

                            {/* Primary Badge */}
                            {image.isPrimary && !image.isUploading && !image.error && (
                                <div className="absolute top-2 left-2 bg-kael-gold text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-current" />
                                    Əsas
                                </div>
                            )}

                            {/* Hover Overlay */}
                            {!image.isUploading && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {!image.isPrimary && !image.error && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-8 text-xs"
                                            onClick={() => handleSetPrimary(image.id!)}
                                        >
                                            <Star className="h-3 w-3 mr-1" />
                                            Əsas et
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 text-xs"
                                        onClick={() => handleRemove(image.id!)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Info */}
            <p className="text-sm text-kael-gray">
                {images.length} / {maxImages} şəkil yüklənib
            </p>
        </div>
    );
}
