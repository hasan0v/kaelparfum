'use client';

import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { removeFromWishlist } from '@/lib/actions/wishlist';

export function RemoveFromWishlistButton({ wishlistId }: { wishlistId: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRemove = async () => {
        startTransition(async () => {
            const result = await removeFromWishlist(wishlistId);
            if (!result.success) {
                console.error(result.error);
            }
        });
    };

    return (
        <button
            onClick={handleRemove}
            disabled={isPending}
            className="p-2 rounded-lg border border-kael-light-gray hover:border-kael-error hover:text-kael-error transition-colors disabled:opacity-50"
            title="Sevimllərdən sil"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    );
}
