// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('authMessage');
    
    messageDiv.textContent = 'Logging in...';
    messageDiv.className = 'message';
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        messageDiv.textContent = 'Login successful! Redirecting...';
        messageDiv.className = 'message success';
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.className = 'message error';
    }
});

// Handle Signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('authMessage');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        messageDiv.textContent = 'Passwords do not match!';
        messageDiv.className = 'message error';
        return;
    }
    
    if (password.length < 6) {
        messageDiv.textContent = 'Password must be at least 6 characters';
        messageDiv.className = 'message error';
        return;
    }
    
    messageDiv.textContent = 'Creating account...';
    messageDiv.className = 'message';
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin + '/dashboard.html'
            }
        });
        
        if (error) throw error;
        
        messageDiv.textContent = 'Account created! Check email for verification.';
        messageDiv.className = 'message success';
        
        // Optional: Auto-login after signup
        setTimeout(async () => {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (!loginError) {
                window.location.href = 'dashboard.html';
            }
        }, 2000);
        
    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.className = 'message error';
    }
});

// Check auth status on page load
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // If user is logged in and on auth page, redirect to dashboard
    if (user && window.location.pathname.includes('auth.html')) {
        window.location.href = 'dashboard.html';
    }
    
    // If user is not logged in and on dashboard, redirect to auth
    if (!user && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'auth.html';
    }
});
