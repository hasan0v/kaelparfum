'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateOrderStatus } from '@/lib/actions/orders';

interface OrderStatusUpdaterProps {
    orderId: string;
    currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus);
        setIsLoading(true);

        try {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
                toast.success('Status yeniləndi');
                router.refresh(); // Refresh server data
            } else {
                toast.error(result.error || 'Xəta baş verdi');
                setStatus(currentStatus); // Revert on error
            }
        } catch (error) {
            toast.error('Xəta baş verdi');
            setStatus(currentStatus);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
            <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="pending">Gözləyir</SelectItem>
                <SelectItem value="processing">Hazırlanır</SelectItem>
                <SelectItem value="shipped">Göndərilib</SelectItem>
                <SelectItem value="delivered">Çatdırılıb</SelectItem>
                <SelectItem value="cancelled">Ləğv edilib</SelectItem>
            </SelectContent>
        </Select>
    );
}
