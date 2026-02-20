import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured =
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id') &&
    !SUPABASE_ANON_KEY.includes('your-anon-key');

// Dummy client for when Supabase is not configured
const dummyClient = {
    auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase is not configured' } }),
        signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: { message: 'Supabase is not configured' } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase is not configured' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: (_event: string, _callback: unknown) => ({
            data: { subscription: { unsubscribe: () => { } } },
        }),
    },
    from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }), range: async () => ({ data: [], count: 0, error: null }) }), data: [], error: null }), ilike: () => ({ data: [], error: null }), or: () => ({ data: [], error: null }), order: () => ({ limit: async () => ({ data: [], error: null }), range: async () => ({ data: [], count: 0, error: null }) }), data: [], error: null }),
        insert: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
        update: async () => ({ eq: async () => ({ data: null, error: { message: 'Supabase is not configured' } }) }),
        upsert: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
        delete: async () => ({ eq: async () => ({ data: null, error: { message: 'Supabase is not configured' } }) }),
    }),
    storage: {
        from: () => ({
            upload: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
    },
} as ReturnType<typeof createBrowserClient>;

export function createClient() {
    if (!isConfigured) {
        return dummyClient;
    }
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
