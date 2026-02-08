import { Metadata } from 'next';
import Link from 'next/link';
import { Package, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { getUser } from '@/lib/actions/auth';

export const metadata: Metadata = {
    title: 'Sifarişlərim',
    description: 'Sifarişlərinizi izləyin',
};

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Gözləyir', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Təsdiqlənib', color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Hazırlanır', color: 'bg-purple-100 text-purple-800' },
    shipped: { label: 'Göndərildi', color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Çatdırıldı', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Ləğv edildi', color: 'bg-red-100 text-red-800' },
};

import { createAdminClient } from '@/lib/supabase/admin';

async function getUserOrders(userId: string) {
    const supabase = await createAdminClient();

    const { data: ordersData } = await supabase
        .from('orders')
        .select(`
            id,
            order_number,
            total,
            status,
            created_at,
            order_items:order_items(
                id,
                product_name,
                quantity,
                unit_price
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return (ordersData as any[]) || [];
}

export default async function OrdersPage() {
    const user = await getUser();
    if (!user) return null;

    const orders = await getUserOrders(user.id);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h1 className="font-heading text-2xl font-bold text-kael-brown">
                    Sifarişlərim
                </h1>
                <p className="text-kael-gray mt-1">
                    Bütün sifarişlərinizi buradan izləyə bilərsiniz
                </p>
            </div>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/hesabim/sifarisler/${order.id}`}
                            className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center">
                                        <Package className="h-6 w-6 text-kael-brown" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-kael-brown">
                                            Sifariş #{order.order_number}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-kael-gray">
                                            <Clock className="h-3.5 w-3.5" />
                                            {new Date(order.created_at).toLocaleDateString('az-AZ', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-kael-brown">
                                            {order.total} ₼
                                        </p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.color || 'bg-gray-100'}`}>
                                            {statusLabels[order.status]?.label || order.status}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-kael-gray" />
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            {order.order_items && order.order_items.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-kael-light-gray">
                                    <p className="text-sm text-kael-gray">
                                        {order.order_items.slice(0, 3).map((item: any) => item.product_name).join(', ')}
                                        {order.order_items.length > 3 && ` +${order.order_items.length - 3} daha`}
                                    </p>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-kael-cream flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="h-8 w-8 text-kael-gray" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-kael-brown mb-2">
                        Sifariş tapılmadı
                    </h3>
                    <p className="text-kael-gray mb-6">
                        Hələ heç bir sifariş verməmisiniz
                    </p>
                    <Link
                        href="/mehsullar"
                        className="inline-block px-6 py-3 bg-kael-gold text-white rounded-full font-medium hover:bg-kael-brown transition-colors"
                    >
                        Alış-verişə başla
                    </Link>
                </div>
            )}
        </div>
    );
}
