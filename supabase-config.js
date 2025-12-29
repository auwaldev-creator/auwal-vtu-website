// supabase-config.js - COMPLETE WORKING VERSION
console.log('Loading Supabase configuration...');

// Your Supabase credentials
const SUPABASE_URL = 'https://emsfczgikwhfjpgwkyqv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AuyN3-6VqWkMn11d1T_wmg_-RagFA47';

// Global Supabase client instance
let supabaseClient = null;

// Initialize Supabase
function initSupabase() {
    try {
        if (typeof supabase === 'undefined') {
            console.warn('⚠️ Supabase library not loaded yet');
            return null;
        }
        
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: window.localStorage,
                storageKey: 'vtu-supabase-auth'
            },
            db: {
                schema: 'public'
            },
            global: {
                headers: {
                    'apikey': SUPABASE_KEY
                }
            }
        });
        
        console.log('✅ Supabase initialized successfully');
        window.supabaseClient = supabaseClient;
        
        // Set up auth state change listener
        setupAuthListener();
        
        return supabaseClient;
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return null;
    }
}

// Set up auth state change listener
function setupAuthListener() {
    if (!supabaseClient) return;
    
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        switch (event) {
            case 'SIGNED_IN':
                console.log('User signed in:', session.user.email);
                // Update profile if needed
                updateUserProfile(session.user);
                break;
                
            case 'SIGNED_OUT':
                console.log('User signed out');
                // Clear any user-specific data
                break;
                
            case 'USER_UPDATED':
                console.log('User updated:', session.user.email);
                break;
                
            case 'TOKEN_REFRESHED':
                console.log('Token refreshed');
                break;
        }
    });
}

// Update or create user profile
async function updateUserProfile(user) {
    if (!supabaseClient || !user) return;
    
    try {
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (fetchError && fetchError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabaseClient
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    full_name: user.email.split('@')[0],
                    balance: 0.00,
                    created_at: new Date()
                });
            
            if (insertError) {
                console.error('Error creating profile:', insertError);
            } else {
                console.log('✅ New profile created for:', user.email);
            }
        } else if (!fetchError && existingProfile) {
            // Profile exists, update email if changed
            if (existingProfile.email !== user.email) {
                const { error: updateError } = await supabaseClient
                    .from('profiles')
                    .update({ email: user.email })
                    .eq('id', user.id);
                
                if (!updateError) {
                    console.log('✅ Profile email updated:', user.email);
                }
            }
        }
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
    }
}

// Get current user
async function getCurrentUser() {
    if (!supabaseClient) {
        await waitForSupabase();
    }
    
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        
        if (error) {
            console.error('Error getting user:', error);
            return null;
        }
        
        return user;
    } catch (error) {
        console.error('Exception getting user:', error);
        return null;
    }
}

// Get user profile
async function getUserProfile(userId) {
    if (!supabaseClient || !userId) return null;
    
    try {
        const { data: profile, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        
        return profile;
    } catch (error) {
        console.error('Exception fetching profile:', error);
        return null;
    }
}

// Wait for Supabase to initialize
async function waitForSupabase() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (supabaseClient) {
                clearInterval(checkInterval);
                resolve(supabaseClient);
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            resolve(null);
        }, 5000);
    });
}

// Check authentication status
async function checkAuth() {
    const user = await getCurrentUser();
    
    if (!user) {
        // Not logged in
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('profile.html') ||
            window.location.pathname.includes('services.html')) {
            window.location.href = 'auth.html';
        }
        return false;
    } else {
        // Logged in
        if (window.location.pathname.includes('auth.html')) {
            window.location.href = 'dashboard.html';
        }
        return true;
    }
}

// Logout function
async function logout() {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return false;
    }
    
    try {
        const { error } = await supabaseClient.auth.signOut();
        
        if (error) {
            console.error('Logout error:', error);
            return false;
        }
        
        // Clear any local storage
        localStorage.removeItem('vtu-user-data');
        
        console.log('✅ User logged out successfully');
        return true;
    } catch (error) {
        console.error('Exception during logout:', error);
        return false;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Supabase...');
    
    // Try to initialize immediately
    if (typeof supabase !== 'undefined') {
        initSupabase();
    } else {
        // Wait for Supabase to load
        const checkSupabase = setInterval(() => {
            if (typeof supabase !== 'undefined') {
                clearInterval(checkSupabase);
                initSupabase();
                
                // Auto-check auth status after initialization
                setTimeout(checkAuth, 1000);
            }
        }, 100);
    }
});

// Manual initialization for pages that load Supabase after DOM
if (typeof supabase !== 'undefined' && !supabaseClient) {
    initSupabase();
}

// Expose functions globally for use in other files
window.initSupabase = initSupabase;
window.getCurrentUser = getCurrentUser;
window.getUserProfile = getUserProfile;
window.checkAuth = checkAuth;
window.logout = logout;

// Export for debugging
console.log('Supabase config loaded and ready');
