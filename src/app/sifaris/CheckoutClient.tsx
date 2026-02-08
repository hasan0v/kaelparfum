'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants/routes';
import { createOrder } from '@/lib/actions/orders';
import { toast } from 'sonner';

interface CheckoutClientProps {
    user?: {
        name?: string | null;
        email?: string | null;
        phone?: string | null;
    } | null;
}

export default function CheckoutClient({ user }: CheckoutClientProps) {
    const { items, getSubtotal, getDeliveryFee, getTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        notes: '',
    });

    // Initialize/Update form data when user prop changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || prev.fullName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
            }));
        }
    }, [user]);

    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getTotal();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleWhatsAppOrder = async () => {
        if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
            toast.error('Zəhmət olmasa bütün məcburi sahələri doldurun');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Create Order in Database
            const result = await createOrder({
                customer: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    city: formData.city,
                    address: formData.address,
                    notes: formData.notes
                },
                items: items.map(item => ({
                    id: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod,
                totals: {
                    subtotal,
                    deliveryFee,
                    total
                }
            });

            if (!result.success) {
                toast.error(result.error || 'Sifariş yaradılarkən xəta baş verdi');
                setIsSubmitting(false);
                return;
            }

            // 2. Generate WhatsApp Message
            const orderNumber = result.orderNumber;
            const itemsList = items.map(item =>
                `• ${item.name} ${item.variantName ? `(${item.variantName})` : ''} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}`
            ).join('\n');

            const message = `🛍️ *Yeni Sifariş!* #${orderNumber}\n\n` +
                `👤 *Müştəri:* ${formData.fullName}\n` +
                `📞 *Əlaqə:* ${formData.phone}\n` +
                `📍 *Ünvan:* ${formData.city}, ${formData.address}\n\n` +
                `🛒 *Sifarişləriniz:*\n${itemsList}\n\n` +
                `💵 *Ödəniş:* ${paymentMethod === 'cash' ? 'Nağd' : 'Kredit'}\n` +
                `🚚 *Çatdırılma:* ${deliveryFee === 0 ? 'Pulsuz' : formatPrice(deliveryFee)}\n` +
                `📝 *Qeyd:* ${formData.notes || 'Yoxdur'}\n\n` +
                `💰 *CƏMİ: ${formatPrice(total)}*`;

            const whatsappLink = `https://wa.me/994709717477?text=${encodeURIComponent(message)}`;

            // 3. Open WhatsApp
            window.open(whatsappLink, '_blank');

            // 4. Clear Cart and Redirect
            clearCart();
            setFormData({
                fullName: '',
                phone: '',
                email: '',
                city: '',
                address: '',
                notes: '',
            });

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Gözlənilməz xəta baş verdi');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Sifariş vermək üçün əvvəlcə məhsul seçin
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
                        <ChevronRight className="h-4 w-4 text-kael-gray" />
                        <Link href={ROUTES.cart} className="text-kael-gray hover:text-kael-brown transition-colors">
                            Səbət
                        </Link>
                        <ChevronRight className="h-4 w-4 text-kael-gray" />
                        <span className="text-kael-brown font-medium">Sifariş</span>
                    </nav>
                </div>
            </div>

            <div className="container py-8">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown mb-8">
                    Sifarişi rəsmiləşdir
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white border border-kael-light-gray rounded-2xl p-6">
                            <h2 className="font-heading text-xl font-semibold text-kael-brown mb-6">
                                Əlaqə məlumatları
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-kael-brown mb-2">
                                        Ad, Soyad *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Ad Soyad"
                                        className="w-full px-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-kael-brown mb-2">
                                        Telefon *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+994 XX XXX XX XX"
                                        className="w-full px-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-kael-brown mb-2">
                                        E-poçt (ixtiyari)
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white border border-kael-light-gray rounded-2xl p-6">
                            <h2 className="font-heading text-xl font-semibold text-kael-brown mb-6">
                                Çatdırılma ünvanı
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-kael-brown mb-2">
                                        Şəhər *
                                    </label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all"
                                        required
                                    >
                                        <option value="">Şəhər seçin</option>
                                        <option value="Bakı">Bakı</option>
                                        <option value="Gəncə">Gəncə</option>
                                        <option value="Sumqayıt">Sumqayıt</option>
                                        <option value="Qəbələ">Qəbələ</option>
                                        <option value="Şəki">Şəki</option>
                                        <option value="Lənkəran">Lənkəran</option>
                                        <option value="Mingəçevir">Mingəçevir</option>
                                        <option value="Digər">Digər</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-kael-brown mb-2">
                                        Ünvan *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Küçə, bina, mənzil..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all resize-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-kael-brown mb-2">
                                        Əlavə qeyd (ixtiyari)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Sifariş haqqında əlavə qeydlər..."
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border border-kael-light-gray rounded-2xl p-6">
                            <h2 className="font-heading text-xl font-semibold text-kael-brown mb-6">
                                Ödəniş üsulu
                            </h2>

                            <div className="space-y-3">
                                <label
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash'
                                        ? 'border-kael-gold bg-kael-gold/5 shadow-sm'
                                        : 'border-kael-light-gray hover:border-kael-gold/50'
                                        }`}
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-kael-gold' : 'border-kael-gray'
                                        }`}>
                                        {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-kael-gold" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-kael-brown">Nağd ödəniş</p>
                                        <p className="text-sm text-kael-gray">Çatdırılma zamanı nağd ödəyin</p>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'credit'
                                        ? 'border-kael-gold bg-kael-gold/5 shadow-sm'
                                        : 'border-kael-light-gray hover:border-kael-gold/50'
                                        }`}
                                    onClick={() => setPaymentMethod('credit')}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit' ? 'border-kael-gold' : 'border-kael-gray'
                                        }`}>
                                        {paymentMethod === 'credit' && <div className="w-2.5 h-2.5 rounded-full bg-kael-gold" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-kael-brown">Kredit</p>
                                        <p className="text-sm text-kael-gray">BirKart ilə faizsiz taksit imkanı</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-kael-cream/50 rounded-2xl p-6">
                            <h2 className="font-heading text-xl font-semibold text-kael-brown mb-6">
                                Sifariş xülasəsi
                            </h2>

                            {/* Order Items */}
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                                            {item.imageUrl ? (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-6 h-6 text-kael-gray" />
                                                </div>
                                            )}
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-kael-brown text-white text-xs rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-kael-brown line-clamp-2">
                                                {item.name}
                                            </p>
                                            {item.variantName && (
                                                <p className="text-xs text-kael-gray">{item.variantName}</p>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium shrink-0">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            {/* Price Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-kael-gray">Ara cəm</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-kael-gray">Çatdırılma</span>
                                    <span className={deliveryFee === 0 ? 'text-kael-success' : ''}>
                                        {deliveryFee === 0 ? 'Pulsuz' : formatPrice(deliveryFee)}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-xl">
                                    <span className="font-semibold text-kael-brown">Cəmi</span>
                                    <span className="font-bold text-kael-rose">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                size="lg"
                                className="w-full mt-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full h-14 text-base font-medium gap-2"
                                onClick={handleWhatsAppOrder}
                                disabled={isSubmitting}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                {isSubmitting ? 'Göndərilir...' : 'WhatsApp ilə sifariş et'}
                            </Button>

                            <p className="text-xs text-kael-gray text-center mt-4">
                                Sifarişi təsdiqlədikdən sonra sizinlə əlaqə saxlanılacaq
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
