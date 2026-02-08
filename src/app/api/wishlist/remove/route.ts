import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { wishlistId } = await request.json();

        if (!wishlistId) {
            return NextResponse.json({ error: 'Wishlist ID required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete wishlist item (only if belongs to user)
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('id', wishlistId)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
