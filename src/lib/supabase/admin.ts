import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Create Supabase admin client with service role key
 * Use this for server-side operations that need to bypass RLS
 */
export async function createAdminClient() {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}
