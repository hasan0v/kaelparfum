'use client';

import { Button } from '@/components/ui/button';
import { Check, Trash2, X } from 'lucide-react';
import { approveReview, deleteReview } from '@/lib/actions/reviews';
import { toast } from 'sonner';
import { useTransition } from 'react';

export function ReviewActions({ review }: { review: any }) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveReview(review.id);
            if (result.success) {
                toast.success('Rəy təsdiqləndi');
            } else {
                toast.error('Xəta baş verdi');
            }
        });
    };

    const handleDelete = () => {
        if (!confirm('Bu rəyi silmək istədiyinizə əminsiniz?')) return;

        startTransition(async () => {
            const result = await deleteReview(review.id);
            if (result.success) {
                toast.success('Rəy silindi');
            } else {
                toast.error('Xəta baş verdi');
            }
        });
    };

    return (
        <div className="flex items-center justify-end gap-2">
            {!review.is_approved && (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                    onClick={handleApprove}
                    disabled={isPending}
                    title="Təsdiqlə"
                >
                    <Check className="h-4 w-4" />
                </Button>
            )}
            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleDelete}
                disabled={isPending}
                title="Sil"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
