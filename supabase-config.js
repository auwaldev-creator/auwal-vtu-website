// supabase-config.js - UPDATED WITH YOUR CREDENTIALS
const SUPABASE_URL = 'https://emsfczgikwhfjpgwkyqv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AuyN3-6VqWkMn11d1T_wmg_-RagFA47';

// Initialize Supabase
let supabase;

function initSupabase() {
    if (window.supabase && window.supabase.createClient) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
        
        console.log('Supabase initialized successfully');
        window.supabaseClient = supabase;
        return supabase;
    } else {
        console.error('Supabase library not loaded');
        return null;
    }
}

// Auto-initialize when Supabase loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}

// Export for use in other files
window.initSupabase = initSupabase;
