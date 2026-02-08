import { createAdminClient } from '@/lib/supabase/admin';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, Trash2, Star, Clock } from 'lucide-react';
import { approveReview, deleteReview } from '@/lib/actions/reviews';
import { toast } from 'sonner';
import { ReviewActions } from './ReviewActions'; // Client component for actions

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
    const supabase = await createAdminClient();

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
            *,
            profiles:user_id(full_name),
            products:product_id(name, slug, image:product_images(image_url))
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
    } else {
        console.log('Fetched reviews count:', reviews?.length);
        console.log('First review sample:', reviews?.[0]);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rəylər</h1>
                    <p className="text-gray-500">Müştəri rəylərini idarə edin</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Məhsul</TableHead>
                            <TableHead>İstifadəçi</TableHead>
                            <TableHead>Reytinq</TableHead>
                            <TableHead>Rəy</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tarix</TableHead>
                            <TableHead className="text-right">Əməliyyatlar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!reviews || reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    Rəy tapılmadı
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review: any) => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium">
                                        {review.products?.name || 'Naməlum məhsul'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{review.profiles?.full_name || 'İstifadəçi'}</span>
                                            {/* Email removed as it's not in profiles table */}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {review.rating} <Star className="h-3 w-3 fill-current" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate" title={review.comment}>
                                        {review.comment || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {review.is_approved ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Təsdiqlənib
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Gözləyir
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ReviewActions review={review} />
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
