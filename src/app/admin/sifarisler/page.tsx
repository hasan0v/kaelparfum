import { createAdminClient } from '@/lib/supabase/admin';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminOrdersPage() {
    const supabase = await createAdminClient();

    const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    const orders = ordersData as any[] || [];

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        processing: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        shipped: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
        delivered: 'bg-green-100 text-green-800 hover:bg-green-100',
        cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sifarişlər</h1>
                    <p className="text-gray-500">Müştəri sifarişlərini idarə edin</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sifariş №</TableHead>
                            <TableHead>Müştəri</TableHead>
                            <TableHead>Ünvan</TableHead>
                            <TableHead>Məbləğ</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tarix</TableHead>
                            <TableHead className="text-right">Əməliyyatlar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!orders || orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    Sifariş tapılmadı
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono font-medium">
                                        #{order.order_number || order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.customer_name}</span>
                                            <span className="text-xs text-gray-400">{order.customer_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate" title={order.address_line1}>
                                        {order.address_line1}
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {formatPrice(order.total)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${statusColors[order.status] || 'bg-gray-100'} border-none shadow-none`}>
                                            {statusLabels[order.status] || order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/sifarisler/${order.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
