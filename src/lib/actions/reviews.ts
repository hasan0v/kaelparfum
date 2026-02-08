'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const reviewSchema = z.object({
    productId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export async function submitReview(data: z.infer<typeof reviewSchema>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Rəy yazmaq üçün daxil olmalısınız' };
    }

    // Verify purchase (Optional: Can enforce only verified reviews here)
    // For now, we allow any logged in user, validation happens via 'is_verified_purchase' flag in manual check or advanced queries.

    const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        product_id: data.productId,
        rating: data.rating,
        comment: data.comment,
        is_approved: false, // Requires admin approval
    });

    if (error) {
        console.log('Review submission DB error:', error);
        if (error.code === '23505') {
            return { success: false, error: 'Siz bu məhsula artıq rəy bildirmisiniz' };
        }
        console.error('Review submit error:', error);
        return { success: false, error: 'Rəy göndərilərkən xəta baş verdi' };
    }

    revalidatePath(`/mehsullar`);
    return { success: true, message: 'Rəyiniz göndərildi və təsdiq gözləyir' };
}

export async function approveReview(reviewId: string) {
    const supabase = await createAdminClient();

    // First fetch the review to get the product_id for revalidation
    const { data: review } = await supabase
        .from('reviews')
        .select('product_id, products(slug)')
        .eq('id', reviewId)
        .single();

    const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

    if (error) {
        console.error('Approve review error:', error);
        return { success: false, error: 'Təsdiq edilmədi' };
    }

    revalidatePath('/admin/serhler');
    // Revalidate the specific product page if we have the slug, otherwise just the main products page
    if (review?.products) {
        // @ts-ignore - Supabase type inference might differ slightly
        const slug = review.products.slug;
        revalidatePath(`/mehsullar/${slug}`);
    } else {
        revalidatePath('/mehsullar');
    }

    return { success: true };
}

export async function deleteReview(reviewId: string) {
    const supabase = await createAdminClient();

    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

    if (error) {
        console.error('Delete review error:', error);
        return { success: false, error: 'Silinmədi' };
    }

    revalidatePath('/admin/serhler');
    return { success: true };
}
