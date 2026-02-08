import Link from 'next/link';
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    ArrowRight,
    Box,
    AlertTriangle,
    TrendingUp,
    Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';

export default async function AdminDashboard() {
    const supabase = await createAdminClient();

    // Parallel data fetching for "Blazing Fast" performance
    const [
        { count: productsCount },
        { count: ordersCount },
        { count: customersCount },
        { data: salesData },
        { data: recentOrders },
        { data: lowStockProducts }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('orders').select('total').neq('status', 'cancelled'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('id, name, stock_quantity, low_stock_threshold').lte('stock_quantity', 5).order('stock_quantity', { ascending: true }).limit(5)
    ]);

    // Calculate total sales
    const totalSales = (salesData as any[])?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

    const stats = [
        {
            title: 'Ümumi Gəlir',
            value: formatPrice(totalSales),
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+12.5%', // Mock data for now
            trendUp: true
        },
        {
            title: 'Sifariş sayı',
            value: ordersCount || 0,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+4.3%',
            trendUp: true
        },
        {
            title: 'Müştərilər',
            value: customersCount || 0,
            icon: Users,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            trend: '+2.1%',
            trendUp: true
        },
        {
            title: 'Aktiv Məhsullar',
            value: productsCount || 0,
            icon: Package,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: '0.0%',
            trendUp: true
        },
    ];

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        processing: 'bg-blue-100 text-blue-700 border-blue-200',
        shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
    };

    const statusLabels: Record<string, string> = {
        pending: 'Gözləyir',
        processing: 'Hazırlanır',
        shipped: 'Göndərilib',
        delivered: 'Çatdırılıb',
        cancelled: 'Ləğv edilib',
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-gray-900">İdarə Paneli</h1>
                    <p className="text-gray-500 mt-1">Mağazanızın cari vəziyyəti və statistikası</p>
                </div>
                <Button className="bg-kael-gold hover:bg-kael-brown text-white shadow-lg shadow-kael-gold/20 transition-all hover:scale-105" asChild>
                    <Link href={ROUTES.admin.products + '/yeni'}>
                        <Package className="h-4 w-4 mr-2" />
                        Yeni Məhsul
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                                <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{stat.trend}</span>
                                    <span className="text-gray-400 font-normal ml-1">keçən ayla müqayisədə</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden bg-white">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-gray-400" />
                            <h3 className="font-heading font-semibold text-gray-900">Son Sifarişlər</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="text-kael-brown hover:text-kael-gold" asChild>
                            <Link href={ROUTES.admin.orders}>
                                Hamısına bax
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left">Sifariş №</th>
                                    <th className="px-6 py-4 text-left">Müştəri</th>
                                    <th className="px-6 py-4 text-left">Məbləğ</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Tarix</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {!recentOrders || recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Hələ sifariş yoxdur
                                        </td>
                                    </tr>
                                ) : (
                                    (recentOrders as any[]).map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <Link href={ROUTES.admin.orderDetail(order.id)} className="font-mono text-sm font-medium text-gray-900 hover:text-kael-gold transition-colors">
                                                    #{order.order_number || order.id.slice(0, 8)}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {order.customer_name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{order.customer_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(order.created_at).toLocaleDateString('az-AZ', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Low Stock & Alerts */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <h3 className="font-heading font-semibold text-gray-900">Az Qalan Məhsullar</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {!lowStockProducts || lowStockProducts.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    Hər şey qaydasındadır
                                </div>
                            ) : (
                                (lowStockProducts as any[]).map((product) => (
                                    <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium text-gray-900 text-sm line-clamp-1" title={product.name}>{product.name}</p>
                                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                                {product.stock_quantity} ədəd
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(((product.stock_quantity || 0) / (product.low_stock_threshold || 5)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 bg-gray-50/50 border-t border-gray-100">
                            <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-kael-brown" asChild>
                                <Link href={ROUTES.admin.products}>
                                    Bütün məhsulları idarə et
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
