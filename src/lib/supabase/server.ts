import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If Supabase is not configured, return a dummy client
    if (
        !supabaseUrl ||
        !supabaseKey ||
        supabaseUrl.includes('your-project-id') ||
        supabaseKey.includes('your-anon-key')
    ) {
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                getSession: async () => ({ data: { session: null }, error: null }),
                exchangeCodeForSession: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase is not configured' } }),
            },
            from: () => ({
                select: (..._args: unknown[]) => ({
                    eq: () => ({ single: async () => ({ data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }), range: async () => ({ data: [], count: 0, error: null }) }) }),
                    order: () => ({ limit: async () => ({ data: [], error: null }), range: async () => ({ data: [], count: 0, error: null }) }),
                    data: [],
                    count: 0,
                    error: null,
                }),
                insert: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
                update: async () => ({ eq: async () => ({ data: null, error: { message: 'Supabase is not configured' } }) }),
                upsert: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
            }),
        } as unknown as ReturnType<typeof createServerClient>;
    }

    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing user sessions.
                }
            },
        },
    });
}
