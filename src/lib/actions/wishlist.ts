'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(productId: string) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Daxil olmalısınız' };
    }

    try {
        // Check if item exists in wishlist
        const { data: existingItem, error: fetchError } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking wishlist:', fetchError);
            return { success: false, error: 'Xəta baş verdi' };
        }

        if (existingItem) {
            // Remove from wishlist
            const { error: deleteError } = await supabase
                .from('wishlists')
                .delete()
                .eq('id', existingItem.id);

            if (deleteError) {
                console.error('Error removing from wishlist:', deleteError);
                return { success: false, error: 'Silinərkən xəta baş verdi' };
            }

            revalidatePath('/hesabim/sevimliler');
            return { success: true, action: 'removed' };
        } else {
            // Add to wishlist
            const { error: insertError } = await supabase
                .from('wishlists')
                .insert({
                    user_id: user.id,
                    product_id: productId,
                });

            if (insertError) {
                console.error('Error adding to wishlist:', insertError);
                return { success: false, error: 'Əlavə edilərkən xəta baş verdi' };
            }

            revalidatePath('/hesabim/sevimliler');
            return { success: true, action: 'added' };
        }
    } catch (error) {
        console.error('Unexpected error in toggleWishlist:', error);
        return { success: false, error: 'Gözlənilməz xəta baş verdi' };
    }
}

export async function checkWishlistStatus(productId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

    return !!data;
}

export async function removeFromWishlist(wishlistId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('id', wishlistId)
            .eq('user_id', user.id);

        if (error) throw error;

        revalidatePath('/hesabim/sevimliler');
        return { success: true };
    } catch (error) {
        console.error('Error removing wishlist item:', error);
        return { success: false, error: 'Failed to remove item' };
    }
}
