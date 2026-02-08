'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, calculateDiscount } from '@/lib/utils/format';
import { useCart } from '@/lib/hooks/useCart';
import { cn } from '@/lib/utils';
import { toggleWishlist, checkWishlistStatus } from '@/lib/actions/wishlist';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        discountPrice?: number | null;
        imageUrl?: string;
        brandName?: string;
        isNew?: boolean;
        stockQuantity: number;
        lowStockThreshold?: number;
        sku: string;
    };
    className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
    const {
        id,
        name,
        slug,
        price,
        discountPrice,
        imageUrl,
        brandName,
        isNew,
        stockQuantity,
        lowStockThreshold = 5,
        sku
    } = product;

    const addToCart = useCart((state) => state.addItem);
    const openCart = useCart((state) => state.openCart);

    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

    useEffect(() => {
        checkWishlistStatus(id).then(setIsInWishlist);
    }, [id]);

    const effectivePrice = discountPrice || price;
    const discountPercentage = discountPrice ? calculateDiscount(price, discountPrice) : 0;

    const stockStatus =
        stockQuantity === 0 ? 'out' :
            stockQuantity <= lowStockThreshold ? 'low' : 'in';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (stockStatus === 'out') return;

        addToCart({
            productId: id,
            name,
            slug,
            imageUrl: imageUrl || '',
            sku,
            price: effectivePrice,
            quantity: 1,
            stockQuantity,
        });
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoadingWishlist) return;
        setIsLoadingWishlist(true);

        try {
            const result = await toggleWishlist(id);
            if (result.success) {
                setIsInWishlist(result.action === 'added');
                toast.success(
                    result.action === 'added'
                        ? 'Sevimlilərə əlavə olundu'
                        : 'Sevimlilərdən silindi'
                );
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error('Xəta baş verdi');
        } finally {
            setIsLoadingWishlist(false);
        }
    };

    return (
        <div
            className={cn(
                "group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
                className
            )}
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {isNew && (
                    <Badge className="bg-kael-sage text-white border-0 text-xs font-medium px-2.5 py-0.5">
                        YENİ
                    </Badge>
                )}
                {discountPercentage > 0 && (
                    <Badge className="bg-kael-rose text-white border-0 text-xs font-medium px-2.5 py-0.5">
                        -{discountPercentage}%
                    </Badge>
                )}
            </div>

            {/* Wishlist Button */}
            <button
                onClick={handleToggleWishlist}
                className={cn(
                    "absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-sm shadow-sm transition-all duration-300",
                    isInWishlist
                        ? "bg-kael-rose text-white opacity-100"
                        : "bg-white/90 opacity-0 group-hover:opacity-100 hover:bg-kael-rose hover:text-white"
                )}
                aria-label="Sevimlilərə əlavə et"
            >
                <Heart className={cn("w-4 h-4", isInWishlist && "fill-current")} />
            </button>

            {/* Share Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (navigator.share) {
                        navigator.share({
                            title: name,
                            text: `KAEL Parfüm: ${name}`,
                            url: window.location.origin + `/mehsullar/${slug}`,
                        }).catch(console.error);
                    } else {
                        navigator.clipboard.writeText(window.location.origin + `/mehsullar/${slug}`);
                        toast.success('Link kopyalandı');
                    }
                }}
                className="absolute top-14 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-kael-gold hover:text-white"
                aria-label="Paylaş"
            >
                <Share2 className="w-4 h-4" />
            </button>

            {/* Image */}
            <Link href={`/mehsullar/${slug}`}>
                <div className="relative aspect-square bg-kael-cream overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-16 h-16 text-kael-light-gray" />
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {stockStatus === 'out' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white/90 text-kael-brown font-medium px-4 py-2 rounded-full text-sm">
                                Stokda yoxdur
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-5">
                {/* Brand */}
                {brandName && (
                    <p className="text-xs text-kael-gray uppercase tracking-wide mb-1">
                        {brandName}
                    </p>
                )}

                {/* Name */}
                <Link href={`/mehsullar/${slug}`}>
                    <h3 className="font-medium text-kael-brown line-clamp-2 min-h-[2.75rem] hover:text-kael-gold transition-colors">
                        {name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2 mb-3">
                    {discountPrice ? (
                        <>
                            <span className="text-lg font-bold text-kael-rose">
                                {formatPrice(discountPrice)}
                            </span>
                            <span className="text-sm text-kael-gray line-through">
                                {formatPrice(price)}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-kael-brown">
                            {formatPrice(price)}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                {stockStatus === 'low' && (
                    <p className="text-xs text-kael-warning mb-3 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-kael-warning"></span>
                        Az qalıb ({stockQuantity} ədəd)
                    </p>
                )}

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    disabled={stockStatus === 'out'}
                    className={cn(
                        "w-full rounded-full font-medium transition-all duration-300",
                        stockStatus === 'out'
                            ? "bg-kael-light-gray text-kael-gray cursor-not-allowed"
                            : "bg-kael-gold hover:bg-kael-brown text-white"
                    )}
                >
                    {stockStatus === 'out' ? 'Stokda yoxdur' : 'Səbətə at'}
                </Button>
            </div>
        </div>
    );
}
