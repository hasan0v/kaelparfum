import { Metadata } from 'next';
import Link from 'next/link';
import { Package, Heart, ChevronRight, Clock } from 'lucide-react';
import { getUser } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Hesabım',
    description: 'KƏEL PARFÜM hesab idarəetməsi',
};

async function getRecentOrders(userId: string) {
    const supabase = await createClient();

    const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, total, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

    return orders || [];
}

async function getWishlistCount(userId: string) {
    const supabase = await createClient();

    const { count } = await supabase
        .from('wishlists')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

    return count || 0;
}

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Gözləyir', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Təsdiqlənib', color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Hazırlanır', color: 'bg-purple-100 text-purple-800' },
    shipped: { label: 'Göndərildi', color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Çatdırıldı', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Ləğv edildi', color: 'bg-red-100 text-red-800' },
};

export default async function AccountDashboard() {
    const user = await getUser();

    if (!user) return null;

    const [recentOrders, wishlistCount] = await Promise.all([
        getRecentOrders(user.id),
        getWishlistCount(user.id),
    ]);

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h1 className="font-heading text-2xl font-bold text-kael-brown">
                    Xoş gəlmisiniz, {user.profile?.full_name || 'İstifadəçi'}!
                </h1>
                <p className="text-kael-gray mt-1">
                    Hesabınızı buradan idarə edə bilərsiniz.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/hesabim/sifarisler"
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-kael-gold/10 flex items-center justify-center">
                                <Package className="h-6 w-6 text-kael-gold" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-kael-brown">{recentOrders.length}</p>
                                <p className="text-sm text-kael-gray">Son sifarişlər</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-kael-gray group-hover:text-kael-gold transition-colors" />
                    </div>
                </Link>

                <Link
                    href="/hesabim/sevimliler"
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-kael-rose/10 flex items-center justify-center">
                                <Heart className="h-6 w-6 text-kael-rose" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-kael-brown">{wishlistCount}</p>
                                <p className="text-sm text-kael-gray">Sevimli məhsullar</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-kael-gray group-hover:text-kael-gold transition-colors" />
                    </div>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-lg font-semibold text-kael-brown">
                        Son Sifarişlər
                    </h2>
                    <Link
                        href="/hesabim/sifarisler"
                        className="text-sm text-kael-gold hover:text-kael-brown transition-colors"
                    >
                        Hamısına bax
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/hesabim/sifarisler/${order.id}`}
                                className="flex items-center justify-between p-4 rounded-xl border border-kael-light-gray hover:border-kael-gold transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-kael-cream flex items-center justify-center">
                                        <Package className="h-5 w-5 text-kael-brown" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-kael-brown">#{order.order_number}</p>
                                        <div className="flex items-center gap-2 text-sm text-kael-gray">
                                            <Clock className="h-3 w-3" />
                                            {new Date(order.created_at).toLocaleDateString('az-AZ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-kael-brown">{order.total} ₼</p>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${statusLabels[order.status]?.color || 'bg-gray-100'}`}>
                                        {statusLabels[order.status]?.label || order.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Package className="h-12 w-12 text-kael-gray/30 mx-auto mb-3" />
                        <p className="text-kael-gray">Hələ sifariş verməmisiniz</p>
                        <Link
                            href="/mehsullar"
                            className="inline-block mt-4 px-6 py-2 bg-kael-gold text-white rounded-full hover:bg-kael-brown transition-colors"
                        >
                            Alış-verişə başla
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
