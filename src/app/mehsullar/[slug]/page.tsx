import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/product/ProductCard';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import ProductReviews from '@/components/product/ProductReviews';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

// Define specific types for our database queries
type ProductWithRelations = Database['public']['Tables']['products']['Row'] & {
    brand: { id: string; name: string; slug: string } | null;
    category: { id: string; name: string; slug: string } | null;
    images: Database['public']['Tables']['product_images']['Row'][];
    variants: Database['public']['Tables']['product_variants']['Row'][];
};

async function getProduct(slug: string) {
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            brand:brands(id, name, slug),
            category:categories(id, name, slug),
            images:product_images(*),
            variants:product_variants(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !product) {
        return null;
    }

    // Cast to our defined type for safety inside the function
    // In a real app we might validate this with Zod, but specifically for TS quirks here:
    const typedProduct = product as unknown as ProductWithRelations;

    // Get review stats
    const { data: reviewStats } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', typedProduct.id as string)
        .eq('is_approved', true);

    const reviewCount = reviewStats?.length || 0;
    const averageRating = reviewCount > 0 && reviewStats
        ? reviewStats.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    // Increment view count
    await supabase.rpc('increment_view_count', { product_id: typedProduct.id as string });

    return {
        ...typedProduct,
        rating: Math.round(averageRating * 10) / 10,
        reviewCount,
    };
}

async function getRelatedProducts(productId: string, categoryId: string | null, brandId: string | null) {
    const supabase = await createClient();

    // First try by category
    const { data: products } = await supabase
        .from('products')
        .select(`
            *,
            brand:brands(name),
            images:product_images(image_url, is_primary)
        `)
        .eq('is_active', true)
        .neq('id', productId)
        .eq('category_id', categoryId || '')
        .limit(4);

    let finalProducts = products || [];

    // If not enough products, try by brand
    if (finalProducts.length < 4 && brandId) {
        const { data: brandProducts } = await supabase
            .from('products')
            .select(`
                *,
                brand:brands(name),
                images:product_images(image_url, is_primary)
            `)
            .eq('is_active', true)
            .neq('id', productId)
            .eq('brand_id', brandId)
            .limit(4 - finalProducts.length);

        if (brandProducts) {
            // Filter out duplicates if any overlap
            const existingIds = new Set(finalProducts.map(p => p.id));
            const newProducts = brandProducts.filter(p => !existingIds.has(p.id));
            finalProducts = [...finalProducts, ...newProducts];
        }
    }

    return finalProducts;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Məhsul tapılmadı',
        };
    }

    const primaryImage = product.images?.find((img) => img.is_primary)?.image_url
        || product.images?.[0]?.image_url;

    return {
        title: product.meta_title || product.name,
        description: product.meta_description || product.short_description,
        openGraph: {
            title: product.name,
            description: product.short_description || '',
            images: primaryImage ? [primaryImage] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    // Ensure safe access to nested properties
    const images = product.images || [];
    const variants = (product.variants || []).filter((v) => v.is_active);

    const supabase = await createClient();
    const { data: approvedReviews } = await supabase
        .from('reviews')
        .select(`
            *,
            profiles:user_id(full_name)
        `)
        .eq('product_id', product.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    const { data: { user } } = await supabase.auth.getUser();

    const relatedProducts = await getRelatedProducts(
        product.id,
        product.category?.id || null,
        product.brand?.id || null
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Client-side interactive component */}
            <ProductDetailClient
                product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    price: product.price,
                    discount_price: product.discount_price,
                    stock_quantity: product.stock_quantity,
                    low_stock_threshold: product.low_stock_threshold,
                    is_new: product.is_new,
                    short_description: product.short_description,
                    description: product.description,
                    ingredients: product.ingredients,
                    usage_instructions: product.usage_instructions,
                    storage_conditions: product.storage_conditions,
                    rating: product.rating,
                    reviewCount: product.reviewCount,
                }}
                images={images}
                variants={variants}
                brand={product.brand}
                category={product.category}
            />

            {/* Product Details Tabs - Server Component */}
            <div className="container pb-16 mt-16 md:mt-24 tesvir-serhler">
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full justify-start border-b border-kael-light-gray rounded-none bg-transparent h-auto p-0 gap-8">
                        <TabsTrigger
                            value="description"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black pb-4 px-0 text-gray-500 hover:text-black transition-colors"
                        >
                            Təsvir
                        </TabsTrigger>
                        {product.ingredients && (
                            <TabsTrigger
                                value="ingredients"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black pb-4 px-0 text-gray-500 hover:text-black transition-colors"
                            >
                                Tərkib
                            </TabsTrigger>
                        )}
                        {product.usage_instructions && (
                            <TabsTrigger
                                value="usage"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black pb-4 px-0 text-gray-500 hover:text-black transition-colors"
                            >
                                İstifadə qaydası
                            </TabsTrigger>
                        )}
                        <TabsTrigger
                            value="reviews"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black pb-4 px-0 text-gray-500 hover:text-black transition-colors"
                        >
                            Şərhlər ({product.reviewCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-8">
                        {product.description ? (
                            <div
                                className="prose prose-lg max-w-none text-gray-600 prose-headings:font-heading prose-headings:text-black prose-a:text-black prose-strong:text-black"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">Bu məhsul üçün təsvir hələ əlavə edilməyib.</p>
                        )}
                    </TabsContent>

                    {product.ingredients && (
                        <TabsContent value="ingredients" className="mt-8">
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {product.ingredients}
                            </p>
                        </TabsContent>
                    )}

                    {product.usage_instructions && (
                        <TabsContent value="usage" className="mt-8">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                                    {product.usage_instructions}
                                </p>
                                {product.storage_conditions && (
                                    <div className="flex items-start gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                                        <strong className="text-black whitespace-nowrap">Saxlama şərtləri:</strong>
                                        <span>{product.storage_conditions}</span>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    )}

                    <TabsContent value="reviews" className="mt-8" id="reviews">
                        <ProductReviews
                            productId={product.id}
                            reviews={approvedReviews || []}
                            user={user}
                        />
                    </TabsContent>
                </Tabs>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
                                Bəyənə biləcəyiniz məhsullar
                            </h2>
                            <Link href="/mehsullar" className="text-sm font-medium hover:text-black transition-colors underline decoration-gray-300 underline-offset-4 hover:decoration-black">
                                Hamısına bax
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
                            {relatedProducts.map((relatedProduct: any) => {
                                const relatedPrimaryImage = relatedProduct.images?.find((img: any) => img.is_primary)?.image_url
                                    || relatedProduct.images?.[0]?.image_url;

                                return (
                                    <ProductCard
                                        key={relatedProduct.id}
                                        product={{
                                            id: relatedProduct.id,
                                            name: relatedProduct.name,
                                            slug: relatedProduct.slug,
                                            price: relatedProduct.price,
                                            discountPrice: relatedProduct.discount_price,
                                            imageUrl: relatedPrimaryImage,
                                            brandName: relatedProduct.brand?.name,
                                            isNew: relatedProduct.is_new,
                                            stockQuantity: relatedProduct.stock_quantity,
                                            lowStockThreshold: relatedProduct.low_stock_threshold,
                                            sku: relatedProduct.sku,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
