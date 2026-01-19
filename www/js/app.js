function initApp() {
    console.log('Initializing Citizen Report App...');
    
    const router = new SimpleRouter("#app");
    
    // Add auth middleware
    router.addMiddleware(async (path) => {
        const publicRoutes = ['/login', '/register', '/'];
        const isLoggedIn = localStorage.getItem("user_token") !== null;
        
        if (!isLoggedIn && !publicRoutes.includes(path)) {
            router.navigate('/login');
            return false; // Block navigation
        }
        
        if (isLoggedIn && (path === '/login' || path === '/register')) {
            router.navigate('/dashboard');
            return false;
        }
        
        return true; // Allow navigation
    });
   
    // Login
    router.addRoute("/login", () => {
        return `
            <div class="login-container">
                <div class="logo">
                    <h1>Citizen Report</h1>
                    <p>Report incidents in your community</p>
                </div>
                
                <div class="card">
                    <h2>Login</h2>
                    
                    <div class="input-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" placeholder="Enter username" value="admin">
                    </div>
                    
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" placeholder="Enter password" value="admin123">
                    </div>
                    
                    <button class="btn btn-primary" onclick="Auth.handleLogin()">
                        Login
                    </button>
                    
                    <button class="btn btn-secondary" onclick="router.navigate('/register')">
                        Register
                    </button>
                    
                    <div class="demo-credentials">
                        <p><small>Test: admin / admin123</small></p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Version 1.0.0</p>
                </div>
            </div>
        `;
    });
    
    // Dashboard
    router.addRoute("/dashboard", () => {
        const username = localStorage.getItem("username") || "User";
        
        return `
            <div class="dashboard">
                <div class="navbar">
                    <h1>Dashboard</h1>
                    <button onclick="Auth.handleLogout()">
                        <span class="material-icons">logout</span>
                    </button>
                </div>
                
                <div class="user-info">
                    <p>Welcome, <strong>${username}</strong></p>
                </div>
                
                <div class="quick-actions">
                    <div class="action-card" onclick="router.navigate('/report')">
                        <span class="material-icons">add_circle</span>
                        <h3>Report Incident</h3>
                        <p>Report a new issue</p>
                    </div>
                    
                    <div class="action-card" onclick="router.navigate('/incidents')">
                        <span class="material-icons">list</span>
                        <h3>View Reports</h3>
                        <p>See all incidents</p>
                    </div>
                    
                    <div class="action-card" onclick="router.navigate('/map')">
                        <span class="material-icons">map</span>
                        <h3>Map View</h3>
                        <p>See incidents on map</p>
                    </div>
                    
                    <div class="action-card" onclick="router.navigate('/profile')">
                        <span class="material-icons">person</span>
                        <h3>Profile</h3>
                        <p>Your account</p>
                    </div>
                </div>
                
                <div class="recent-incidents">
                    <h3>Recent Incidents</h3>
                    <div id="recent-list">
                        <p>No incidents yet. Be the first to report!</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    router.addRoute("/report", () => {
        return `
            <div class="report-incident">
                <div class="navbar">
                    <button onclick="router.navigate('/dashboard')">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <h1>Report Incident</h1>
                    <div></div>
                </div>
                
                <div class="form-container">
                    <div class="card">
                        <div class="input-group">
                            <label for="title">Title *</label>
                            <input type="text" id="title" placeholder="Brief title of incident">
                        </div>
                        
                        <div class="input-group">
                            <label for="description">Description *</label>
                            <textarea id="description" placeholder="Describe what happened"></textarea>
                        </div>
                        
                        <div class="input-group">
                            <label for="category">Category</label>
                            <select id="category">
                                <option value="vandalism">Vandalism</option>
                                <option value="pothole">Pothole</option>
                                <option value="garbage">Illegal Dumping</option>
                                <option value="streetlight">Street Light Issue</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="input-group">
                            <label>Location</label>
                            <div id="location-info">
                                <p>Click to get location</p>
                                <button class="btn-small" onclick="Location.getCurrentLocation()">
                                    <span class="material-icons">my_location</span> Get Location
                                </button>
                            </div>
                            <input type="hidden" id="latitude">
                            <input type="hidden" id="longitude">
                        </div>
                        
                        <div class="input-group">
                            <label>Photo (Optional)</label>
                            <div id="photo-preview">
                                <p>No photo selected</p>
                            </div>
                            <button class="btn btn-secondary" onclick="Camera.takePhoto()">
                                <span class="material-icons">camera_alt</span> Take Photo
                            </button>
                            <button class="btn btn-small" onclick="Camera.selectFromGallery()" 
                                style="margin-left: 10px; background: #6c757d;">
                                <span class="material-icons">photo_library</span> Gallery
                            </button>
                            <input type="hidden" id="photo-data">
                        </div>
                        
                        <button class="btn btn-primary" onclick="Incidents.submitIncident()" id="submit-btn">
                            Submit Report
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    router.addRoute("/incidents", () => {
        return `
            <div class="incidents-list">
                <div class="navbar">
                    <button onclick="router.navigate('/dashboard')">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <h1>All Incidents</h1>
                    <button onclick="Incidents.refreshIncidents()">
                        <span class="material-icons">refresh</span>
                    </button>
                </div>
                
                <div class="filters">
                    <select id="category-filter" onchange="Incidents.filterIncidents()">
                        <option value="">All Categories</option>
                        <option value="vandalism">Vandalism</option>
                        <option value="pothole">Pothole</option>
                        <option value="garbage">Illegal Dumping</option>
                        <option value="streetlight">Street Light</option>
                    </select>
                </div>
                
                <div class="incidents-container" id="incidents-container">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading incidents...</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    router.addRoute("/map", () => {
        return `
            <div class="map-view">
                <div class="navbar">
                    <button onclick="router.navigate('/dashboard')">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <h1>Map View</h1>
                    <button onclick="Map.refreshMap()">
                        <span class="material-icons">refresh</span>
                    </button>
                </div>
                
                <div id="map-container">
                    <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
                        <div style="text-align: center;">
                            <span class="material-icons" style="font-size: 60px; color: #667eea;">map</span>
                            <p>Map view will display incidents here</p>
                            <button class="btn-small" onclick="Map.centerOnUser()">
                                <span class="material-icons">my_location</span> Show My Location
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    router.addRoute("/register", () => {
        return `
            <div class="register-container">
                <div class="navbar">
                    <button onclick="router.navigate('/login')">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <h1>Register</h1>
                    <div></div>
                </div>
                
                <div class="card">
                    <h2>Create Account</h2>
                    
                    <div class="input-group">
                        <label for="reg-username">Username *</label>
                        <input type="text" id="reg-username" placeholder="Choose username">
                    </div>
                    
                    <div class="input-group">
                        <label for="reg-email">Email *</label>
                        <input type="email" id="reg-email" placeholder="your@email.com">
                    </div>
                    
                    <div class="input-group">
                        <label for="reg-password">Password *</label>
                        <input type="password" id="reg-password" placeholder="Create password">
                    </div>
                    
                    <div class="input-group">
                        <label for="reg-confirm">Confirm Password *</label>
                        <input type="password" id="reg-confirm" placeholder="Confirm password">
                    </div>
                    
                    <button class="btn btn-primary" onclick="Auth.handleRegister()">
                        Register
                    </button>
                </div>
            </div>
        `;
    });

    router.addRoute("/profile", () => {
        const username = localStorage.getItem("username") || "User";
        const email = localStorage.getItem("user_email") || "Not set";

        return `
            <div class="profile">
                <div class="navbar">
                    <button onclick="router.navigate('/dashboard')">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <h1>Profile</h1>
                    <div></div>
                </div>
                
                <div class="card">
                    <div class="user-avatar">
                        <span class="material-icons">account_circle</span>
                        <h2>${username}</h2>
                    </div>
                    
                    <div class="profile-info">
                        <div class="info-item">
                            <span class="material-icons">email</span>
                            <div>
                                <p class="label">Email</p>
                                <p>${email}</p>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <span class="material-icons">date_range</span>
                            <div>
                                <p class="label">Member Since</p>
                                <p>${new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <span class="material-icons">assignment</span>
                            <div>
                                <p class="label">Reports Submitted</p>
                                <p id="report-count">0</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="btn btn-secondary" onclick="Auth.handleLogout()">
                            <span class="material-icons">logout</span> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    router.addRoute("/", () => {
        const isLoggedIn = localStorage.getItem("user_token") !== null;
        return isLoggedIn ? router.routes["/dashboard"]() : router.routes["/login"]();
    });

    router.start();
    
    initializeModules();
    
    console.log("lized successfully");
}

function initializeModules() {
    console.log("Initializing modules...");
    
    if (typeof Auth === "undefined") {
        console.warn("Auth module not loaded");
    }

    if (typeof Camera === "undefined") {
        console.warn("Camera module not loaded");
    }
    
    if (typeof Location === "undefined") {
        console.warn("Location module not loaded");
    }
    
    // Incidents module
    if (typeof Incidents === "undefined") {
        console.warn("Incidents module not loaded");
    }
    
    // Map module
    if (typeof Map === "undefined") {
        console.warn("Map module not loaded");
    }
}




window.Camera = {
    takePhoto: function() {
        alert("Camera will work in production build. For now, use Gallery.");
        // Trigger file input as fallback
        this.selectFromGallery();
    },
    selectFromGallery: function() {
        // Simple file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64 = event.target.result.split(',')[1];
                    
                    // Update preview
                    const preview = document.getElementById('photo-preview');
                    if (preview) {
                        preview.innerHTML = `
                            <img src="data:image/jpeg;base64,${base64}" 
                                 style="max-width: 150px; border-radius: 8px;">
                            <p style="color: green; font-size: 12px;">✓ Photo selected</p>
                        `;
                    }
                    
                    // Store data
                    document.getElementById('photo-data').value = base64;
                    alert("Photo selected from gallery!");
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    },
    clearPhoto: function() {
        const preview = document.getElementById('photo-preview');
        if (preview) {
            preview.innerHTML = '<p>No photo selected</p>';
        }
        document.getElementById('photo-data').value = '';
    }
};