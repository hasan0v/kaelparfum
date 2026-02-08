import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Package } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/product/ProductCard';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
    const supabase = await createClient();

    const { data: category, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !category) {
        return null;
    }

    return category;
}

async function getCategoryProducts(categoryId: string) {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id, name, slug, sku, price, discount_price, stock_quantity, low_stock_threshold, is_new,
            brand:brands(name),
            images:product_images(image_url, is_primary)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching category products:', error);
        return [];
    }

    return products || [];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        return { title: 'Kateqoriya tapılmadı' };
    }

    return {
        title: `${category.name} | Kateqoriyalar`,
        description: category.description || `${category.name} kateqoriyasından məhsullar`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    const products = await getCategoryProducts(category.id);

    return (
        <div className="bg-kael-cream/30 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-kael-light-gray">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm flex-wrap">
                        <Link href={ROUTES.home} className="text-kael-gray hover:text-kael-brown transition-colors">
                            Ana səhifə
                        </Link>
                        <ChevronRight className="h-4 w-4 text-kael-gray" />
                        <Link href="/kateqoriyalar" className="text-kael-gray hover:text-kael-brown transition-colors">
                            Kateqoriyalar
                        </Link>
                        <ChevronRight className="h-4 w-4 text-kael-gray" />
                        <span className="text-kael-brown font-medium">{category.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown mb-2">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-kael-gray max-w-2xl">
                            {category.description}
                        </p>
                    )}
                    <p className="text-kael-gray mt-2">
                        {products.length} məhsul tapıldı
                    </p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product: any) => {
                            const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url
                                || product.images?.[0]?.image_url;

                            return (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        slug: product.slug,
                                        price: product.price,
                                        discountPrice: product.discount_price,
                                        imageUrl: primaryImage,
                                        brandName: product.brand?.name,
                                        isNew: product.is_new,
                                        stockQuantity: product.stock_quantity,
                                        lowStockThreshold: product.low_stock_threshold,
                                        sku: product.sku,
                                    }}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-kael-cream flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-kael-gray" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-kael-brown mb-2">
                            Məhsul tapılmadı
                        </h3>
                        <p className="text-kael-gray mb-4">
                            Bu kateqoriyada hələ məhsul yoxdur.
                        </p>
                        <Link
                            href="/mehsullar"
                            className="inline-flex items-center gap-2 text-kael-gold hover:text-kael-brown transition-colors"
                        >
                            Bütün məhsullara bax
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
