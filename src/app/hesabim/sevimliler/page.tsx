import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { getUser } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';
import { RemoveFromWishlistButton } from './RemoveButton';

export const metadata: Metadata = {
    title: 'Sevimlilər',
    description: 'Sevimli məhsullarınız',
};

async function getUserWishlist(userId: string) {
    const supabase = await createClient();

    const { data: wishlistItems } = await supabase
        .from('wishlists')
        .select(`
            id,
            product_id,
            products:product_id(
                id,
                name,
                slug,
                price,
                discount_price,
                stock_quantity,
                brand:brands(name),
                images:product_images(image_url, is_primary)
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return wishlistItems || [];
}

export default async function WishlistPage() {
    const user = await getUser();
    if (!user) return null;

    const wishlistItems = await getUserWishlist(user.id);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h1 className="font-heading text-2xl font-bold text-kael-brown">
                    Sevimlilər
                </h1>
                <p className="text-kael-gray mt-1">
                    {wishlistItems.length} məhsul
                </p>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((item: any) => {
                        const product = item.products;
                        if (!product) return null;

                        const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url
                            || product.images?.[0]?.image_url;

                        const effectivePrice = product.discount_price || product.price;
                        const hasDiscount = product.discount_price && product.discount_price < product.price;

                        return (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                                <div className="flex">
                                    {/* Product Image */}
                                    <Link
                                        href={`/mehsullar/${product.slug}`}
                                        className="relative w-32 h-32 sm:w-40 sm:h-40 bg-kael-cream shrink-0"
                                    >
                                        {primaryImage ? (
                                            <Image
                                                src={primaryImage}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="160px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="h-10 w-10 text-kael-gray/30" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1 p-4 flex flex-col">
                                        {product.brand?.name && (
                                            <p className="text-xs text-kael-gray uppercase tracking-wider">
                                                {product.brand.name}
                                            </p>
                                        )}
                                        <Link
                                            href={`/mehsullar/${product.slug}`}
                                            className="font-medium text-kael-brown hover:text-kael-gold transition-colors line-clamp-2 mt-1"
                                        >
                                            {product.name}
                                        </Link>

                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="font-bold text-kael-brown">
                                                {effectivePrice} ₼
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-sm text-kael-gray line-through">
                                                    {product.price} ₼
                                                </span>
                                            )}
                                        </div>

                                        {/* Stock Status */}
                                        <p className={`text-sm mt-1 ${product.stock_quantity > 0 ? 'text-kael-success' : 'text-kael-error'}`}>
                                            {product.stock_quantity > 0 ? 'Stokda var' : 'Stokda yoxdur'}
                                        </p>

                                        {/* Actions */}
                                        <div className="mt-auto pt-3 flex items-center gap-2">
                                            <Link
                                                href={`/mehsullar/${product.slug}`}
                                                className="flex-1 text-center py-2 bg-kael-gold text-white rounded-lg text-sm font-medium hover:bg-kael-brown transition-colors"
                                            >
                                                Bax
                                            </Link>
                                            <RemoveFromWishlistButton wishlistId={item.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-kael-rose/10 flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-kael-rose" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-kael-brown mb-2">
                        Sevimlilər boşdur
                    </h3>
                    <p className="text-kael-gray mb-6">
                        Bəyəndiyiniz məhsulları sevimlilərə əlavə edin
                    </p>
                    <Link
                        href="/mehsullar"
                        className="inline-block px-6 py-3 bg-kael-gold text-white rounded-full font-medium hover:bg-kael-brown transition-colors"
                    >
                        Məhsullara bax
                    </Link>
                </div>
            )}
        </div>
    );
}
