import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Award } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getBrands() {
    const supabase = await createClient();

    const { data: brands, error } = await supabase
        .from('brands')
        .select('id, name, slug, logo_url, description')
        .eq('is_active', true)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching brands:', error);
        return [];
    }

    // Get product count for each brand
    const brandsWithCount = await Promise.all(
        (brands || []).map(async (brand) => {
            const { count } = await supabase
                .from('products')
                .select('id', { count: 'exact', head: true })
                .eq('brand_id', brand.id)
                .eq('is_active', true);

            return {
                ...brand,
                productCount: count || 0,
            };
        })
    );

    return brandsWithCount;
}

export default async function BrandsPage() {
    const brands = await getBrands();

    return (
        <div className="bg-kael-cream/30 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-kael-light-gray">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href={ROUTES.home} className="text-kael-gray hover:text-kael-brown transition-colors">
                            Ana səhifə
                        </Link>
                        <ChevronRight className="h-4 w-4 text-kael-gray" />
                        <span className="text-kael-brown font-medium">Brendlər</span>
                    </nav>
                </div>
            </div>

            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown mb-2">
                        Brendlər
                    </h1>
                    <p className="text-kael-gray">
                        Dünyanın ən məşhur parfüm brendləri
                    </p>
                </div>

                {/* Brands Grid */}
                {brands.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/brendler/${brand.slug}`}
                                className="group bg-white rounded-xl p-6 text-center hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                {/* Logo or Initial */}
                                <div className="aspect-square max-w-[100px] mx-auto mb-4 rounded-full bg-kael-cream flex items-center justify-center overflow-hidden">
                                    {brand.logo_url ? (
                                        <Image
                                            src={brand.logo_url}
                                            alt={brand.name}
                                            width={80}
                                            height={80}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <span className="font-heading text-2xl text-kael-gold font-bold">
                                            {brand.name.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Brand Name */}
                                <h3 className="font-heading font-semibold text-kael-brown group-hover:text-kael-gold transition-colors">
                                    {brand.name}
                                </h3>

                                {/* Product Count */}
                                <p className="text-sm text-kael-gray mt-1">
                                    {brand.productCount} məhsul
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-kael-cream flex items-center justify-center mx-auto mb-4">
                            <Award className="h-8 w-8 text-kael-gray" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-kael-brown mb-2">
                            Brend tapılmadı
                        </h3>
                        <p className="text-kael-gray">
                            Hal-hazırda aktiv brend yoxdur.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
