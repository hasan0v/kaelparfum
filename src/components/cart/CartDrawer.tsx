'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants/routes';
import { DELIVERY_CONFIG } from '@/lib/constants/config';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function CartDrawer() {
    const pathname = usePathname();
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        getSubtotal,
        getDeliveryFee,
        getTotal,
        getTotalQuantity
    } = useCart();

    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getTotal();
    const itemCount = getTotalQuantity();
    const progress = Math.min((subtotal / DELIVERY_CONFIG.freeDeliveryThreshold) * 100, 100);

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-l border-kael-light-gray shadow-2xl bg-white">
                <SheetDescription className="sr-only">Səbətinizdəki məhsulların siyahısı</SheetDescription>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-kael-light-gray/50 bg-white">
                    <div className="flex items-center gap-3">
                        <SheetTitle className="font-heading text-xl font-medium text-kael-brown">Səbətim</SheetTitle>
                        <span className="bg-kael-gold/10 text-kael-gold text-xs font-medium px-2 py-1 rounded-full">
                            {itemCount} məhsul
                        </span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-9 h-9 rounded-full bg-transparent hover:bg-kael-light-gray/50 transition-colors flex items-center justify-center text-kael-gray hover:text-kael-brown"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Free Delivery Progress */}
                {items.length > 0 && (
                    <div className="px-6 py-4 bg-kael-cream/30 border-b border-kael-light-gray/50">
                        {subtotal < DELIVERY_CONFIG.freeDeliveryThreshold ? (
                            <div className="space-y-2">
                                <p className="text-sm text-kael-gray">
                                    Pulsuz çatdırılma üçün daha <span className="font-medium text-kael-brown">{formatPrice(DELIVERY_CONFIG.freeDeliveryThreshold - subtotal)}</span> məbləğində sifariş et
                                </p>
                                <div className="h-1.5 w-full bg-kael-light-gray/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-kael-gold rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <Truck className="w-3.5 h-3.5" />
                                </span>
                                Təbriklər! Çatdırılma pulsuzdur
                            </div>
                        )}
                    </div>
                )}

                {items.length === 0 ? (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                        <div className="w-20 h-20 rounded-full bg-kael-cream/50 flex items-center justify-center mb-6">
                            <ShoppingBag className="w-8 h-8 text-kael-gold" />
                        </div>
                        <h3 className="font-heading text-xl font-medium text-kael-brown mb-2">
                            Səbətiniz boşdur
                        </h3>
                        <p className="text-kael-gray mb-8 max-w-xs text-sm leading-relaxed">
                            Bəyəndiyiniz parfümləri səbətə əlavə edərək alış-verişə başlayın
                        </p>
                        <Button
                            onClick={closeCart}
                            className="bg-kael-brown hover:bg-black text-white rounded-full px-8 h-12 text-sm font-medium transition-colors"
                            asChild
                        >
                            <Link href={ROUTES.products}>
                                Alış-verişə davam et
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-2">
                            <AnimatePresence mode="popLayout">
                                <div className="space-y-6 py-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex gap-4 group"
                                        >
                                            {/* Image */}
                                            <Link
                                                href={`${ROUTES.products}/${item.slug}`}
                                                onClick={closeCart}
                                                className="relative w-20 h-24 bg-kael-cream/30 rounded-lg overflow-hidden shrink-0 border border-transparent hover:border-kael-gold/20 transition-all"
                                            >
                                                {item.imageUrl ? (
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-6 h-6 text-kael-gray/30" />
                                                    </div>
                                                )}
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <Link
                                                            href={`${ROUTES.products}/${item.slug}`}
                                                            onClick={closeCart}
                                                            className="font-heading font-medium text-kael-brown hover:text-kael-gold transition-colors line-clamp-2 text-sm leading-snug"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-kael-gray hover:text-red-500 transition-colors p-1 -mr-2 -mt-1"
                                                            aria-label="Sil"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {item.variantName && (
                                                        <p className="text-xs text-kael-gray mt-1">
                                                            {item.variantName}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    <div className="flex items-center border border-kael-light-gray rounded-full h-8 px-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-7 h-full flex items-center justify-center text-kael-gray hover:text-kael-brown disabled:opacity-30 disabled:hover:text-kael-gray transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-sm font-medium text-kael-brown">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-full flex items-center justify-center text-kael-gray hover:text-kael-brown disabled:opacity-30 disabled:hover:text-kael-gray transition-colors"
                                                            disabled={item.quantity >= item.stockQuantity}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="font-medium text-kael-brown">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white border-t border-kael-light-gray">
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-kael-gray">Ara cəm</span>
                                    <span className="font-medium text-kael-brown">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-kael-gray">Çatdırılma</span>
                                    {deliveryFee === 0 ? (
                                        <span className="text-green-600 font-medium">Pulsuz</span>
                                    ) : (
                                        <span className="font-medium text-kael-brown">{formatPrice(deliveryFee)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-kael-light-gray/50">
                                    <span className="font-heading text-lg font-bold text-kael-brown">Cəmi</span>
                                    <span className="font-heading text-xl font-bold text-kael-brown">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-kael-brown hover:bg-black text-white rounded-full h-12 text-sm font-medium transition-all group"
                                asChild
                            >
                                <Link href={ROUTES.checkout} onClick={closeCart}>
                                    Sifarişi rəsmiləşdir
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
