// Load user data
async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Display user info
    document.getElementById('userName').textContent = user.email.split('@')[0];
    document.getElementById('userEmail').textContent = user.email;
    
    // Fetch profile data
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (!error && profile) {
        document.getElementById('userBalance').textContent = profile.balance || '0.00';
        
        // Update full name if available
        if (profile.full_name) {
            document.getElementById('userName').textContent = profile.full_name;
        }
    }
}

// Load transactions
async function loadTransactions() {
    const { data, error } = await supabase
        .from('transactions') // You need to create this table
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (error) {
        console.error('Error loading transactions:', error);
        return;
    }
    
    const container = document.getElementById('transactionsList');
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p>No transactions yet</p>';
        return;
    }
    
    container.innerHTML = data.map(transaction => `
        <div class="transaction-item">
            <div>
                <strong>${transaction.service}</strong>
                <p>${new Date(transaction.created_at).toLocaleString()}</p>
            </div>
            <div class="amount ${transaction.type}">
                ${transaction.type === 'debit' ? '-' : '+'}₦${transaction.amount}
            </div>
        </div>
    `).join('');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadTransactions();
    
    // Auto-refresh every 30 seconds
    setInterval(loadUserData, 30000);
});
