import Link from 'next/link';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic';

interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    discount_price: number | null;
    stock_quantity: number;
    low_stock_threshold: number;
    is_new: boolean;
    brand: { name: string } | null;
    images: { image_url: string; is_primary: boolean }[];
}

import { getProducts } from '@/lib/actions/products';

export default async function ProductsPage(props: {
    searchParams: Promise<{ search?: string }>;
}) {
    const searchParams = await props.searchParams;
    const search = searchParams.search;

    const result = await getProducts({
        search,
        status: 'active',
        limit: 40
    });

    const products = (result.success ? result.products : []) as Product[];
    const total = result.total;
    const error = result.success ? null : result.error as string;

    return (
        <div className="bg-kael-cream/30 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-kael-light-gray">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href={ROUTES.home} className="text-kael-gray hover:text-kael-brown">
                            Ana səhifə
                        </Link>
                        <ChevronRight className="h-4 w-4 text-kael-gray" />
                        <span className="text-kael-brown font-medium">Məhsullar</span>
                    </nav>
                </div>
            </div>

            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown mb-2">
                        {search ? `"${search}" üçün axtarış nəticələri` : 'Bütün məhsullar'}
                    </h1>
                    <p className="text-kael-gray">
                        {error ? 'Xəta baş verdi' : `${total} məhsul tapıldı`}
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <p className="text-kael-error mb-4">{error}</p>
                        <Button asChild className="bg-kael-gold hover:bg-kael-brown text-white rounded-full">
                            <Link href="/">Ana səhifəyə qayıt</Link>
                        </Button>
                    </div>
                )}

                {/* Products Grid */}
                {!error && products.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => {
                            const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;

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
                )}

                {/* Empty State */}
                {!error && products.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-kael-cream flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-kael-gray" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-kael-brown mb-2">
                            Məhsul tapılmadı
                        </h3>
                        <p className="text-kael-gray mb-6">
                            Hal-hazırda satışda olan məhsul yoxdur.
                        </p>
                        <Button asChild className="bg-kael-gold hover:bg-kael-brown text-white rounded-full">
                            <Link href="/">Ana səhifəyə qayıt</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
