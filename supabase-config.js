// Supabase configuration
const SUPABASE_URL = 'https://emsfczgikwhfjpgwkyqv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AuyN3-6VqWkMn11d1T_wmg_-RagFA47';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// Export for use in other files
window.supabase = supabase;
