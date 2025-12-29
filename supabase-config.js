// Supabase Configuration
console.log('Loading Supabase configuration...');

// Your Supabase credentials
const SUPABASE_URL = 'https://emsfczgikwhfjpgwkyqv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AuyN3-6VqWkMn11d1T_wmg_-RagFA47';

// Initialize Supabase when the library is loaded
function initSupabase() {
    if (typeof supabase !== 'undefined') {
        try {
            const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true
                }
            });
            
            window.supabaseClient = supabaseClient;
            console.log('✅ Supabase initialized successfully');
            return supabaseClient;
        } catch (error) {
            console.error('❌ Error initializing Supabase:', error);
            return null;
        }
    } else {
        console.warn('⚠️ Supabase library not loaded yet');
        return null;
    }
}

// Try to initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Supabase...');
    initSupabase();
});

// Also try to initialize if Supabase loads after DOM
if (typeof supabase !== 'undefined') {
    initSupabase();
}

// Export for debugging
window.initSupabase = initSupabase;
