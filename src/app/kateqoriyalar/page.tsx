import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, FolderOpen } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getCategories() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug, image_url, description')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
        (categories || []).map(async (category) => {
            const { count } = await supabase
                .from('products')
                .select('id', { count: 'exact', head: true })
                .eq('category_id', category.id)
                .eq('is_active', true);

            return {
                ...category,
                productCount: count || 0,
            };
        })
    );

    return categoriesWithCount;
}

export default async function CategoriesPage() {
    const categories = await getCategories();

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
                        <span className="text-kael-brown font-medium">Kateqoriyalar</span>
                    </nav>
                </div>
            </div>

            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown mb-2">
                        Kateqoriyalar
                    </h1>
                    <p className="text-kael-gray">
                        Bütün kateqoriyaları kəşf edin
                    </p>
                </div>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/kateqoriyalar/${category.slug}`}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-kael-cream"
                            >
                                {/* Background Image or Gradient */}
                                {category.image_url ? (
                                    <Image
                                        src={category.image_url}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-kael-gold/20 via-kael-rose/10 to-transparent" />
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6 text-center text-white">
                                    <h3 className="font-heading text-lg md:text-xl font-semibold mb-1 group-hover:text-kael-gold transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-white/70">
                                        {category.productCount} məhsul
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-kael-cream flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="h-8 w-8 text-kael-gray" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-kael-brown mb-2">
                            Kateqoriya tapılmadı
                        </h3>
                        <p className="text-kael-gray">
                            Hal-hazırda aktiv kateqoriya yoxdur.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
