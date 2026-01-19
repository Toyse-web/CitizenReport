const Auth = {
    handleLogin: async function() {
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        
        if (!username || !password) {
            this.showError('Please enter username and password');
            return;
        }
        
        // Show loading
        const btn = document.querySelector('#login-btn');
        if (btn) btn.disabled = true;
        
        try {
            // Use API login
            const result = await API.login(username, password);
            
            if (result.success) {
                localStorage.setItem('user_token', result.token);
                localStorage.setItem('username', result.user.username);
                localStorage.setItem('user_email', result.user.email);
                
                this.showSuccess(`Welcome ${result.user.username}!`);
                router.navigate('/dashboard');
            } else {
                this.showError('Login failed. Please check credentials.');
            }
        } catch (error) {
            this.showError('Login error: ' + error.message);
        } finally {
            if (btn) btn.disabled = false;
        }
    },
    
    handleLogout: function() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_email');
        router.navigate('/login');
    },
    
    handleRegister: async function() {
        const username = document.getElementById('reg-username')?.value;
        const email = document.getElementById('reg-email')?.value;
        const password = document.getElementById('reg-password')?.value;
        const confirm = document.getElementById('reg-confirm')?.value;
        
        if (!username || !email || !password || !confirm) {
            this.showError('All fields are required');
            return;
        }
        
        if (password !== confirm) {
            this.showError('Passwords do not match');
            return;
        }
        
        // Mock registration
        localStorage.setItem('user_token', 'reg_token_' + Date.now());
        localStorage.setItem('username', username);
        localStorage.setItem('user_email', email);
        
        this.showSuccess('Registration successful!');
        router.navigate('/dashboard');
    },
    
    showError: function(msg) {
        alert('❌ ' + msg);
    },
    
    showSuccess: function(msg) {
        alert('✅ ' + msg);
    }
};

window.Auth = Auth;