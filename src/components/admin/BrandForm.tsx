'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ROUTES } from '@/lib/constants/routes';
import { createBrand, updateBrand } from '@/lib/actions/brands';
import { toast } from 'sonner';

interface BrandFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function BrandForm({ initialData, isEdit = false }: BrandFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        website: initialData?.website || '',
        logoUrl: initialData?.logo_url || '',
        isActive: initialData?.is_active ?? true,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from name only if creating new and slug is untouched
        if (name === 'name' && !isEdit && !formData.slug) {
            const slug = value
                .toLowerCase()
                .replace(/ə/g, 'e')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ş/g, 's')
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dataToSubmit = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
                website: formData.website || undefined,
                logo_url: formData.logoUrl || undefined,
                is_active: formData.isActive,
            };

            let result;
            if (isEdit && initialData?.id) {
                result = await updateBrand(initialData.id, dataToSubmit);
            } else {
                result = await createBrand(dataToSubmit);
            }

            if (result.success) {
                toast.success(isEdit ? 'Brend yeniləndi!' : 'Brend yaradıldı!');
                router.push(ROUTES.admin.brands);
                router.refresh();
            } else {
                toast.error(result.error || 'Xəta baş verdi');
            }
        } catch (error) {
            console.error('Error saving brand:', error);
            toast.error('Xəta baş verdi');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.admin.brands}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? 'Brendi redaktə et' : 'Yeni Brend'}
                        </h1>
                        <p className="text-gray-500">
                            {isEdit ? 'Brend məlumatlarını yeniləyin' : 'Yeni brend əlavə edin'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href={ROUTES.admin.brands}>Ləğv et</Link>
                    </Button>
                    <Button
                        type="submit"
                        className="bg-kael-gold hover:bg-kael-brown text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saxlanılır...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Saxla
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Əsas məlumatlar</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brend adı *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="Məs: Chanel"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="chanel"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Haqqında
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20 resize-none"
                                    placeholder="Brend haqqında məlumat..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vebsayt
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="https://www.chanel.com"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Logo (Simple URL input for now) */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Loqo</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loqo URL-i
                                </label>
                                <input
                                    type="text"
                                    name="logoUrl"
                                    value={formData.logoUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="https://example.com/logo.png"
                                />
                                <p className="text-xs text-gray-500 mt-1">Hələlik birbaşa URL daxil edin</p>
                            </div>
                            {formData.logoUrl && (
                                <div className="mt-4 relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={formData.logoUrl}
                                        alt="Brand Logo Preview"
                                        className="max-w-full max-h-full object-contain p-2"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Invalid+Logo';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleCheckboxChange('isActive', checked as boolean)}
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Aktiv</p>
                                    <p className="text-sm text-gray-500">Brend saytda görünəcək</p>
                                </div>
                            </label>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
}
