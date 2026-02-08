'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants/routes';
import { DELIVERY_CONFIG } from '@/lib/constants/config';

export default function CartPage() {
    const {
        items,
        removeItem,
        updateQuantity,
        getSubtotal,
        getDeliveryFee,
        getTotal,
        getTotalQuantity,
        clearCart,
    } = useCart();

    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getTotal();
    const itemCount = getTotalQuantity();

    if (items.length === 0) {
        return (
            <div className="container py-16 md:py-24">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-24 h-24 rounded-full bg-kael-cream flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-kael-gray" />
                    </div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown mb-4">
                        Səbətiniz boşdur
                    </h1>
                    <p className="text-kael-gray mb-8">
                        Alış-verişə başlamaq üçün məhsulları səbətə əlavə edin
                    </p>
                    <Button
                        className="bg-kael-gold hover:bg-kael-brown text-white rounded-full px-8"
                        asChild
                    >
                        <Link href={ROUTES.products}>
                            Alış-verişə başla
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-kael-cream/50 py-4">
                <div className="container">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-kael-gray hover:text-kael-brown transition-colors">
                            Ana səhifə
                        </Link>
                        <span className="text-kael-gray">/</span>
                        <span className="text-kael-brown font-medium">Səbət</span>
                    </nav>
                </div>
            </div>

            <div className="container py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown">
                        Səbətim ({itemCount} məhsul)
                    </h1>
                    <Button
                        variant="ghost"
                        className="text-kael-gray hover:text-kael-error"
                        onClick={clearCart}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Səbəti təmizlə
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-4 md:p-6 bg-white border border-kael-light-gray rounded-2xl"
                            >
                                {/* Product Image */}
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-kael-cream shrink-0">
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-10 h-10 text-kael-gray" />
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                        <div>
                                            <Link
                                                href={`${ROUTES.products}/${item.slug}`}
                                                className="font-medium text-kael-brown hover:text-kael-gold transition-colors line-clamp-2"
                                            >
                                                {item.name}
                                            </Link>
                                            {item.variantName && (
                                                <p className="text-sm text-kael-gray mt-1">
                                                    Həcm: {item.variantName}
                                                </p>
                                            )}
                                            <p className="text-xs text-kael-gray mt-1">SKU: {item.sku}</p>
                                        </div>
                                        <p className="text-xl font-bold text-kael-rose shrink-0">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-kael-light-gray rounded-full">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-kael-cream transition-colors rounded-l-full"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-kael-cream transition-colors rounded-r-full"
                                                disabled={item.quantity >= item.stockQuantity}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-kael-gray hover:text-kael-error transition-colors p-2 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="hidden sm:inline text-sm">Sil</span>
                                        </button>
                                    </div>

                                    {/* Stock Warning */}
                                    {item.quantity >= item.stockQuantity && (
                                        <p className="text-xs text-kael-warning mt-2">
                                            Maksimum mövcud miqdar
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <div className="pt-4">
                            <Button
                                variant="outline"
                                className="border-kael-brown text-kael-brown hover:bg-kael-cream rounded-full"
                                asChild
                            >
                                <Link href={ROUTES.products}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Alış-verişə davam et
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-kael-cream/50 rounded-2xl p-6">
                            <h2 className="font-heading text-xl font-semibold text-kael-brown mb-6">
                                Sifariş xülasəsi
                            </h2>

                            {/* Free Delivery Progress */}
                            {subtotal < DELIVERY_CONFIG.freeDeliveryThreshold && (
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-kael-gray">Pulsuz çatdırılmaya</span>
                                        <span className="font-medium text-kael-brown">
                                            {formatPrice(DELIVERY_CONFIG.freeDeliveryThreshold - subtotal)} qalıb
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-kael-light-gray rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-kael-gold rounded-full transition-all"
                                            style={{ width: `${(subtotal / DELIVERY_CONFIG.freeDeliveryThreshold) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-kael-gray">Ara cəm</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-kael-gray">Çatdırılma</span>
                                    <span className={deliveryFee === 0 ? 'text-kael-success font-medium' : 'font-medium'}>
                                        {deliveryFee === 0 ? 'Pulsuz' : formatPrice(deliveryFee)}
                                    </span>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between text-xl">
                                    <span className="font-semibold text-kael-brown">Cəmi</span>
                                    <span className="font-bold text-kael-rose">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mt-6">
                                <Button
                                    size="lg"
                                    className="w-full bg-kael-gold hover:bg-kael-brown text-white rounded-full h-14 text-base font-medium"
                                    asChild
                                >
                                    <Link href={ROUTES.checkout}>
                                        Sifarişi rəsmiləşdir
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full h-14 text-base font-medium gap-2"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp ilə sifariş et
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-kael-light-gray">
                                <div className="flex items-center justify-center gap-4 text-xs text-kael-gray">
                                    <span>🔒 Təhlükəsiz ödəniş</span>
                                    <span>📦 Sürətli çatdırılma</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
