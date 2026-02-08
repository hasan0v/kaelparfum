'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUploader from '@/components/admin/ImageUploader';
import { ROUTES } from '@/lib/constants/routes';
import { createProduct, updateProduct, getCategories, getBrands } from '@/lib/actions/products';
import { toast } from 'sonner';

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Use existing ID if editing, otherwise generate a new one for image uploads before creating
    const [productId] = useState(() => initialData?.id || crypto.randomUUID());

    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        sku: initialData?.sku || '',
        description: initialData?.description || '',
        shortDescription: initialData?.short_description || '',
        price: initialData?.price || '',
        discountPrice: initialData?.discount_price || '',
        stockQuantity: initialData?.stock_quantity !== undefined ? initialData.stock_quantity : '',
        lowStockThreshold: initialData?.low_stock_threshold || '5',
        categoryId: initialData?.category_id || '',
        brandId: initialData?.brand_id || '',
        isActive: initialData?.is_active ?? true,
        isFeatured: initialData?.is_featured ?? false,
        isNew: initialData?.is_new ?? true,
    });

    // Fetch categories and brands on mount
    useEffect(() => {
        async function fetchData() {
            const [catResult, brandResult] = await Promise.all([
                getCategories(),
                getBrands(),
            ]);

            if (catResult.success) setCategories(catResult.categories);
            if (brandResult.success) setBrands(brandResult.brands);
        }
        fetchData();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from name only if creating new product and slug is untouched
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
                sku: formData.sku,
                description: formData.description || undefined,
                short_description: formData.shortDescription || undefined,
                price: parseFloat(formData.price),
                discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                stock_quantity: parseInt(formData.stockQuantity),
                low_stock_threshold: parseInt(formData.lowStockThreshold) || 5,
                category_id: formData.categoryId,
                brand_id: formData.brandId,
                is_active: formData.isActive,
                is_featured: formData.isFeatured,
                is_new: formData.isNew,
            };

            let result;
            if (isEdit) {
                result = await updateProduct(productId, dataToSubmit);
            } else {
                // Pass the pre-generated ID implicitly by handling it via images association later? 
                // Actually createProduct usually lets DB generate ID or we pass it.
                // The current createProduct action doesn't accept ID. 
                // But ImageUploader uploads using `productId`. 
                // If we rely on DB generated ID, the images uploaded with `productId` (client-generated UUID) won't match.
                // We should modify createProduct to accept an ID or update Image records after creation.
                // EASIEST WAY: Pass the `productId` (client generated UUID) to `createProduct`. 
                // I need to check if `createProduct` accepts ID. It currently doesn't.
                // BUT: Supabase INSERT can accept ID. I'll modifying createProduct to accept ID.

                // WAIT: Checking `createProduct` in `products.ts`...
                // It does `.insert({...data})`. If I add `id: productId` to data, it should work.

                result = await createProduct({
                    ...dataToSubmit,
                    id: productId, // Passing the ID we used for images
                } as any);
            }

            if (result.success) {
                toast.success(isEdit ? 'Məhsul yeniləndi!' : 'Məhsul yaradıldı!');
                router.push(ROUTES.admin.products);
                router.refresh();
            } else {
                toast.error(result.error || 'Xəta baş verdi');
            }
        } catch (error) {
            console.error('Error saving product:', error);
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
                        <Link href={ROUTES.admin.products}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? 'Məhsulu redaktə et' : 'Yeni Məhsul'}
                        </h1>
                        <p className="text-gray-500">
                            {isEdit ? 'Məhsul məlumatlarını yeniləyin' : 'Yeni məhsul əlavə edin'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href={ROUTES.admin.products}>Ləğv et</Link>
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
                                    Məhsul adı *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="Məs: Chanel No. 5 Eau de Parfum"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                        placeholder="chanel-no-5-eau-de-parfum"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SKU *
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                        placeholder="CH-N5-EDP-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Qısa təsvir
                                </label>
                                <textarea
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20 resize-none"
                                    placeholder="Məhsul haqqında qısa məlumat..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ətraflı təsvir
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20 resize-none"
                                    placeholder="Məhsul haqqında ətraflı məlumat..."
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Images */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Şəkillər</h3>
                        <ImageUploader
                            productId={productId}
                            initialImages={initialData?.images?.map((img: any) => ({
                                id: img.id,
                                url: img.image_url,
                                isPrimary: img.is_primary,
                            }))}
                            maxImages={10}
                        />
                    </Card>

                    {/* Pricing */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Qiymət və stok</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Qiymət (₼) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Endirimli qiymət (₼)
                                </label>
                                <input
                                    type="number"
                                    name="discountPrice"
                                    value={formData.discountPrice}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stok miqdarı *
                                </label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Az stok həddi
                                </label>
                                <input
                                    type="number"
                                    name="lowStockThreshold"
                                    value={formData.lowStockThreshold}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    placeholder="5"
                                />
                            </div>
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
                                    <p className="text-sm text-gray-500">Məhsul saytda görünəcək</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    checked={formData.isFeatured}
                                    onCheckedChange={(checked) => handleCheckboxChange('isFeatured', checked as boolean)}
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Seçilmiş</p>
                                    <p className="text-sm text-gray-500">Ana səhifədə göstərilsin</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    checked={formData.isNew}
                                    onCheckedChange={(checked) => handleCheckboxChange('isNew', checked as boolean)}
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Yeni məhsul</p>
                                    <p className="text-sm text-gray-500">"Yeni" etiketi göstərilsin</p>
                                </div>
                            </label>
                        </div>
                    </Card>

                    {/* Category & Brand */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Təşkilat</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kateqoriya *
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    required
                                >
                                    <option value="">Kateqoriya seçin</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brend *
                                </label>
                                <select
                                    name="brandId"
                                    value={formData.brandId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                                    required
                                >
                                    <option value="">Brend seçin</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
}
