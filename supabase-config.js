// supabase-config.js - SIMPLIFIED
console.log('Loading Supabase config...');

const SUPABASE_URL = 'https://emsfczgikwhfjpgwkyqv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AuyN3-6VqWkMn11d1T_wmg_-RagFA47';

// Initialize when Supabase is available
function initSupabase() {
    if (window.supabase && window.supabase.createClient) {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabaseClient = supabase;
        console.log('Supabase client created');
        return supabase;
    }
    return null;
}

// Try to initialize
window.supabaseInit = initSupabase;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}
