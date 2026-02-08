import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if already in wishlist
        const { data: existing } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

        if (existing) {
            // Remove from wishlist
            await supabase
                .from('wishlists')
                .delete()
                .eq('id', existing.id);

            return NextResponse.json({ added: false });
        } else {
            // Add to wishlist
            await supabase
                .from('wishlists')
                .insert({
                    user_id: user.id,
                    product_id: productId,
                });

            return NextResponse.json({ added: true });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
