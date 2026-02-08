import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, Package, MapPin, Phone, Clock, Truck } from 'lucide-react';
import { getUser } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';

interface OrderPageProps {
    params: Promise<{ id: string }>;
}

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Gözləyir', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Təsdiqlənib', color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Hazırlanır', color: 'bg-purple-100 text-purple-800' },
    shipped: { label: 'Göndərildi', color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Çatdırıldı', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Ləğv edildi', color: 'bg-red-100 text-red-800' },
};

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

async function getOrder(orderId: string, userId: string) {
    const supabase = await createClient();

    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items:order_items(
                id,
                product_id,
                product_name,
                product_sku,
                product_image_url,
                variant_name,
                quantity,
                unit_price,
                total_price
            )
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

    if (error || !order) {
        return null;
    }

    return order;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
    return {
        title: 'Sifariş detalları',
    };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
    const { id } = await params;
    const user = await getUser();

    if (!user) return null;

    const order = await getOrder(id, user.id);

    if (!order) {
        notFound();
    }

    const currentStepIndex = statusSteps.indexOf(order.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <Link
                    href="/hesabim/sifarisler"
                    className="inline-flex items-center gap-2 text-kael-gray hover:text-kael-brown mb-4"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Sifarişlərə qayıt
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-kael-brown">
                            Sifariş #{order.order_number}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 text-sm text-kael-gray">
                            <Clock className="h-4 w-4" />
                            {new Date(order.created_at).toLocaleDateString('az-AZ', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    </div>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusLabels[order.status]?.color || 'bg-gray-100'}`}>
                        {statusLabels[order.status]?.label || order.status}
                    </span>
                </div>
            </div>

            {/* Order Progress - only if not cancelled */}
            {order.status !== 'cancelled' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-heading text-lg font-semibold text-kael-brown mb-6">
                        Sifariş statusu
                    </h2>
                    <div className="relative">
                        <div className="flex justify-between">
                            {statusSteps.map((step, index) => (
                                <div key={step} className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStepIndex
                                            ? 'bg-kael-success text-white'
                                            : 'bg-kael-light-gray text-kael-gray'
                                        }`}>
                                        {index < currentStepIndex ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : index === 0 ? (
                                            <Package className="w-5 h-5" />
                                        ) : index === statusSteps.length - 1 ? (
                                            <Truck className="w-5 h-5" />
                                        ) : (
                                            <span className="text-sm font-medium">{index + 1}</span>
                                        )}
                                    </div>
                                    <span className="mt-2 text-xs text-center text-kael-gray">
                                        {statusLabels[step]?.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-kael-light-gray -z-10" />
                        <div
                            className="absolute top-5 left-0 h-0.5 bg-kael-success transition-all -z-10"
                            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-kael-brown mb-4">
                    Sifariş edilən məhsullar
                </h2>
                <div className="divide-y divide-kael-light-gray">
                    {order.order_items.map((item: any) => (
                        <div key={item.id} className="py-4 flex gap-4">
                            <div className="w-20 h-20 bg-kael-cream rounded-lg overflow-hidden flex-shrink-0">
                                {item.product_image_url ? (
                                    <Image
                                        src={item.product_image_url}
                                        alt={item.product_name}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-8 w-8 text-kael-gray/30" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-kael-brown">{item.product_name}</h3>
                                {item.variant_name && (
                                    <p className="text-sm text-kael-gray">{item.variant_name}</p>
                                )}
                                <p className="text-sm text-kael-gray">SKU: {item.product_sku}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-kael-brown">{item.total_price} ₼</p>
                                <p className="text-sm text-kael-gray">{item.quantity} x {item.unit_price} ₼</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Address */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-heading text-lg font-semibold text-kael-brown mb-4">
                        Çatdırılma ünvanı
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-kael-gold shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-kael-brown">{order.customer_name}</p>
                                <p className="text-kael-gray">{order.address_line1}</p>
                                {order.address_line2 && <p className="text-kael-gray">{order.address_line2}</p>}
                                <p className="text-kael-gray">{order.city} {order.postal_code}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-kael-gold" />
                            <p className="text-kael-gray">{order.customer_phone}</p>
                        </div>
                    </div>
                </div>

                {/* Order Total */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-heading text-lg font-semibold text-kael-brown mb-4">
                        Ödəniş məlumatları
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-kael-gray">Məhsullar</span>
                            <span className="text-kael-brown">{order.subtotal} ₼</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-kael-gray">Çatdırılma</span>
                            <span className="text-kael-brown">
                                {order.delivery_fee > 0 ? `${order.delivery_fee} ₼` : 'Pulsuz'}
                            </span>
                        </div>
                        {order.discount_amount > 0 && (
                            <div className="flex justify-between text-kael-success">
                                <span>Endirim</span>
                                <span>-{order.discount_amount} ₼</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-kael-light-gray flex justify-between font-semibold">
                            <span className="text-kael-brown">Cəmi</span>
                            <span className="text-lg text-kael-brown">{order.total} ₼</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
