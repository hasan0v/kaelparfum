import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import OrderStatusUpdater from './OrderStatusUpdater';

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const supabase = await createAdminClient();

    const { data: orderData } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(name, slug, images:product_images(image_url))
            )
        `)
        .eq('id', id)
        .single();

    const order = orderData as any; // Temporary fix for Generic inference issues

    if (!order) {
        notFound();
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels: Record<string, string> = {
        pending: 'Gözləyir',
        processing: 'Hazırlanır',
        shipped: 'Göndərilib',
        delivered: 'Çatdırılıb',
        cancelled: 'Ləğv edilib',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        Sifariş #{order.order_number || order.id.slice(0, 8)}
                        <Badge className={`${statusColors[order.status] || 'bg-gray-100'} px-3 py-1 text-sm border-none`}>
                            {statusLabels[order.status] || order.status}
                        </Badge>
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleString('az-AZ')}
                    </p>
                </div>
                <div className="flex gap-2 items-center">



                    {/* Status Updater */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline">Qaimə çap et</Button>
                        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Məhsullar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="py-4 flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {/* Simplified image handling */}
                                            {item.product?.images?.[0]?.image_url && (
                                                <img
                                                    src={item.product.images[0].image_url}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.product?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatPrice(item.unit_price)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {formatPrice(item.total_price)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Ara cəmi</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Çatdırılma</span>
                                    <span>{formatPrice(order.delivery_fee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                                    <span>Cəmi</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Müştəri Məlumatları</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                                <p className="font-medium">{order.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="font-medium">{order.customer_email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Telefon</p>
                                <p className="font-medium">{order.customer_phone || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Çatdırılma Ünvanı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-line">
                                {order.address_line1}
                                {order.address_line2 && `\n${order.address_line2}`}
                                {`\n${order.city}`}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
