"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    Star,
    Heart,
    Share2,
    ShoppingBag,
    Truck,
    Shield,
    RotateCcw,
    Minus,
    Plus,
    Check,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils/format";
import { useCart } from "@/lib/hooks/useCart";
import { toggleWishlist, checkWishlistStatus } from "@/lib/actions/wishlist";

// --- Types ---

interface ProductImage {
    id: string;
    image_url: string;
    alt_text?: string;
    is_primary?: boolean;
    display_order?: number;
}

interface ProductVariant {
    id: string;
    name: string;
    price_adjustment: number;
    stock_quantity: number;
    is_active: boolean;
}

interface Brand {
    id: string;
    name: string;
    slug: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface ProductDetailProps {
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        price: number;
        discount_price?: number | null;
        stock_quantity: number;
        low_stock_threshold: number;
        is_new?: boolean;
        short_description?: string | null;
        description?: string | null;
        ingredients?: string | null;
        usage_instructions?: string | null;
        storage_conditions?: string | null;
        rating: number;
        reviewCount: number;
    };
    images: ProductImage[];
    variants: ProductVariant[];
    brand: Brand | null;
    category: Category | null;
}

// --- Components ---

const StarRating = ({ rating, className }: { rating: number; className?: string }) => (
    <div className={cn("flex items-center gap-0.5", className)}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={cn(
                    "h-3.5 w-3.5",
                    star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                )}
            />
        ))}
        {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
        )}
    </div>
);

const ZoomableImage = ({ src, alt }: { src: string; alt: string }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const imgRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;
        const { left, top, width, height } = imgRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div
            className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50 cursor-crosshair group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            ref={imgRef}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-contain p-8 transition-transform duration-500 ease-out"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Magnifier Lens / Effects could go here */}

            {/* High Res Zoomed View */}
            <div
                className={cn(
                    "absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 ease-in-out",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                    backgroundSize: "200%",
                    backgroundRepeat: "no-repeat"
                }}
            />
        </div>
    );
};

export const ProductDetailClient: React.FC<ProductDetailProps> = ({
    product,
    images,
    variants,
    brand,
    category,
}) => {
    const { addItem } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(
        variants.length > 0 ? variants[0].id : null
    );
    const [quantity, setQuantity] = React.useState(1);
    const [isWishlisted, setIsWishlisted] = React.useState(false);
    const [isLoadingWishlist, setIsLoadingWishlist] = React.useState(false);

    React.useEffect(() => {
        checkWishlistStatus(product.id).then(setIsWishlisted);
    }, [product.id]);

    const handleToggleWishlist = async () => {
        if (isLoadingWishlist) return;
        setIsLoadingWishlist(true);

        try {
            const result = await toggleWishlist(product.id);
            if (result.success) {
                setIsWishlisted(result.action === 'added');
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

    const sortedImages = [...images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    const currentImage = sortedImages[currentImageIndex];

    const selectedVariant = variants.find(v => v.id === selectedVariantId);
    const effectivePrice = product.discount_price || product.price;
    const variantPriceAdjustment = selectedVariant?.price_adjustment || 0;
    const finalPrice = effectivePrice + variantPriceAdjustment;

    const basePrice = product.price + variantPriceAdjustment;
    const isDiscounted = !!product.discount_price;
    const discountPercentage = isDiscounted
        ? calculateDiscount(product.price, product.discount_price!)
        : 0;

    const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
    const stockStatus =
        currentStock === 0 ? 'out' :
            currentStock <= product.low_stock_threshold ? 'low' : 'in';

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(prev + delta, currentStock)));
    };

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            variantId: selectedVariantId || undefined,
            name: product.name,
            slug: product.slug,
            imageUrl: currentImage?.image_url || "/placeholder.png",
            sku: product.sku,
            price: finalPrice,
            quantity: quantity,
            stockQuantity: currentStock,
            variantName: selectedVariant?.name,
        });
        toast.success("Məhsul səbətə əlavə edildi!", {
            description: `${product.name} (${quantity} ədəd)`,
            action: {
                label: "Səbətə bax",
                onClick: () => document.dispatchEvent(new CustomEvent("open-cart"))
            }
        });
    };

    const handleWhatsAppOrder = () => {
        const variantText = selectedVariant ? ` (${selectedVariant.name})` : "";
        const message = `Salam! "${product.name}${variantText}" məhsulunu sifariş etmək istəyirəm.\n\nMiqdar: ${quantity}\nQiymət: ${formatPrice(finalPrice * quantity)}`;
        window.open(`https://wa.me/994709717477?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="w-full bg-white font-sans">
            {/* Breadcrumb - Clean & Minimal */}
            <div className="container py-4">
                <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                    <Link href="/" className="hover:text-black transition-colors">Ana səhifə</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/mehsullar" className="hover:text-black transition-colors">Məhsullar</Link>
                    {category && (
                        <>
                            <ChevronRight className="h-3 w-3" />
                            <Link href={`/kateqoriyalar/${category.slug}`} className="hover:text-black transition-colors">
                                {category.name}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-black font-medium line-clamp-1">{product.name}</span>
                </nav>
            </div>

            <div className="container pb-12 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* LEFT COLUMN: Gallery */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Mobile Actions */}
                        <div className="flex justify-between items-center lg:hidden">
                            {product.is_new ? (
                                <Badge className="bg-black text-white hover:bg-black rounded-sm uppercase tracking-wider text-[10px] px-2 py-1">Yeni</Badge>
                            ) : <div></div>}
                            <div className="flex gap-2">
                                <button onClick={handleToggleWishlist} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Heart className={cn("h-6 w-6", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-900")} />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Share2 className="h-6 w-6 text-gray-900" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            {/* Thumbnails Vertical (Desktop) / Horizontal (Mobile) */}
                            {sortedImages.length > 1 && (
                                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-hide py-1 px-1">
                                    {sortedImages.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={cn(
                                                "relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden border transition-all duration-300",
                                                currentImageIndex === index
                                                    ? "border-black ring-1 ring-black/10"
                                                    : "border-transparent bg-gray-50 hover:border-gray-300"
                                            )}
                                        >
                                            <Image
                                                src={image.image_url}
                                                alt={image.alt_text || "Product thumbnail"}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Zoomable Image */}
                            <div className="flex-1 relative">
                                <div className="sticky top-24">
                                    <ZoomableImage
                                        src={currentImage?.image_url || "/placeholder.png"}
                                        alt={currentImage?.alt_text || product.name}
                                    />

                                    {/* Desktop Actions Overlay */}
                                    <div className="absolute top-4 right-4 flex-col gap-3 hidden lg:flex z-10">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleToggleWishlist}
                                            className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all"
                                        >
                                            <Heart className={cn("h-5 w-5", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700")} />
                                        </motion.button>
                                    </div>

                                    {/* Status Badges Overlay */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                        {product.is_new && (
                                            <Badge className="bg-black text-white hover:bg-black uppercase tracking-wider text-[10px] px-3 py-1.5 shadow-sm">
                                                Yeni
                                            </Badge>
                                        )}
                                        {discountPercentage > 0 && (
                                            <Badge className="bg-red-600 text-white hover:bg-red-700 uppercase tracking-wider text-[10px] px-3 py-1.5 shadow-sm">
                                                -{discountPercentage}%
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info & Actions */}
                    <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-0">
                        {brand && (
                            <Link
                                href={`/brands/${brand.slug}`}
                                className="text-sm font-medium text-kael-gold uppercase tracking-[0.2em] mb-3 hover:text-black transition-colors w-fit"
                            >
                                {brand.name}
                            </Link>
                        )}

                        <h1 className="font-heading text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            {product.reviewCount > 0 ? (
                                <Link href="#reviews" className="flex items-center gap-2 group">
                                    <StarRating rating={product.rating} />
                                    <span className="text-sm text-gray-500 group-hover:text-black transition-colors border-b border-transparent group-hover:border-black">
                                        {product.reviewCount} rəy
                                    </span>
                                </Link>
                            ) : (
                                <span className="text-sm text-gray-400">Hələ rəy yoxdur</span>
                            )}
                            <div className="h-4 w-[1px] bg-gray-200" />
                            <span className="text-sm text-gray-500 font-mono">SKU: {product.sku}</span>
                        </div>

                        {/* Price Section */}
                        <div className="flex flex-col mb-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                    {formatPrice(finalPrice)}
                                </span>
                                {isDiscounted && (
                                    <span className="text-xl text-gray-400 line-through decoration-gray-300">
                                        {formatPrice(basePrice)}
                                    </span>
                                )}
                            </div>

                            {/* Stock Indicator */}
                            <div className="flex items-center gap-2 text-sm mt-2">
                                {stockStatus === 'in' && (
                                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </span>
                                        Stokda var ({currentStock} ədəd)
                                    </span>
                                )}
                                {stockStatus === 'low' && (
                                    <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                                        <AlertCircle className="h-4 w-4" />
                                        Az qalıb! ({currentStock} ədəd)
                                    </span>
                                )}
                                {stockStatus === 'out' && (
                                    <span className="flex items-center gap-1.5 text-red-600 font-medium">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                        Stokda yoxdur
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Variants Selector */}
                        {variants.length > 0 && (
                            <div className="mb-8">
                                <span className="text-sm font-medium text-gray-900 mb-3 block">Həcm seçimi</span>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => !variant.stock_quantity ? null : setSelectedVariantId(variant.id)}
                                            disabled={variant.stock_quantity === 0}
                                            className={cn(
                                                "min-w-[80px] px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                                selectedVariantId === variant.id
                                                    ? "border-black bg-black text-white shadow-lg shadow-black/10 scale-105"
                                                    : "border-gray-200 text-gray-900 hover:border-gray-400 bg-white",
                                                variant.stock_quantity === 0 && "opacity-50 cursor-not-allowed bg-gray-50"
                                            )}
                                        >
                                            {variant.name}
                                            {variant.stock_quantity === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px]">
                                                    <div className="w-[120%] h-[1px] bg-red-400 rotate-12 absolute" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                {product.short_description}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-4 mt-auto">
                            <div className="flex gap-4 h-14">
                                {/* Quantity Stepper */}
                                <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 px-2 min-w-[140px]">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1 || stockStatus === 'out'}
                                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="flex-1 text-center font-semibold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= currentStock || stockStatus === 'out'}
                                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    disabled={stockStatus === 'out'}
                                    className="flex-1 h-full rounded-full bg-black hover:bg-gray-800 text-white text-base font-medium shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
                                >
                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                    Səbətə əlavə et
                                </Button>
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleWhatsAppOrder}
                                className="w-full h-12 rounded-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-semibold gap-2 transition-all"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp ilə sifariş
                            </Button>
                        </div>

                        {/* Trust Factors */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-full">
                                    <Truck className="h-5 w-5 text-gray-700" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">Pulsuz çatdırılma</span>
                                    <span className="text-xs text-gray-500">50₼ üzəri</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-full">
                                    <Shield className="h-5 w-5 text-gray-700" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">Orijinal məhsul</span>
                                    <span className="text-xs text-gray-500">100% zəmanət</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-full">
                                    <RotateCcw className="h-5 w-5 text-gray-700" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">Geri qaytarma</span>
                                    <span className="text-xs text-gray-500">14 gün ərzində</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
