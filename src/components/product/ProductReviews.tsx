'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Star, User } from 'lucide-react';
import { submitReview } from '@/lib/actions/reviews';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface ProductReviewsProps {
    productId: string;
    reviews: any[]; // Passed from server component
    user: any; // Passed from server component
}

export default function ProductReviews({ productId, reviews, user }: ProductReviewsProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Zəhmət olmasa ulduz verin');
            return;
        }

        startTransition(async () => {
            const result = await submitReview({
                productId,
                rating,
                comment
            });

            if (result.success) {
                toast.success(result.message);
                setRating(0);
                setComment('');
            } else {
                toast.error(result.error);
            }
        });
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="mt-16 border-t border-gray-100 pt-10">
            <h2 className="font-heading text-2xl font-bold text-kael-brown mb-8 flex items-center gap-4">
                Müştəri Rəyləri
                <span className="text-base font-normal text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {reviews.length} rəy
                </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Summary & Form */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Rating Summary */}
                    <div className="bg-kael-cream/30 p-6 rounded-2xl text-center">
                        <div className="text-5xl font-bold text-kael-brown mb-2">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-2 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-5 h-5",
                                        star <= Math.round(Number(averageRating)) ? "fill-current" : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm">Ümumi reytinq</p>
                    </div>

                    {/* Review Form */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Rəy yazın</h3>
                        {user ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Qiymətləndirmə
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-colors"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-8 h-8 transition-colors",
                                                        star <= (hoverRating || rating)
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-gray-300"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Şərhiniz (könüllü)
                                    </label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Məhsul haqqında fikirləriniz..."
                                        className="resize-none"
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-kael-brown hover:bg-kael-gold text-white"
                                    disabled={isPending}
                                >
                                    {isPending ? 'Göndərilir...' : 'Rəyi Paylaş'}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 mb-3">Rəy yazmaq üçün daxil olmalısınız</p>
                                <Button variant="outline" asChild>
                                    <a href="/login">Daxil ol</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl">
                            <p className="text-gray-500">Hələ heç bir rəy yoxdur. İlk rəyi siz yazın!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">
                                            {review.profiles?.full_name || 'İstifadəçi'}
                                        </h4>
                                        <span className="text-sm text-gray-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex text-amber-400 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "w-4 h-4",
                                                    star <= review.rating ? "fill-current" : "text-gray-300"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
