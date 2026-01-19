// ======================
// MOCK WORDPRESS API (for development)
// ======================

const API = {
    baseURL: 'https://your-wordpress-site.com/wp-json/wp/v2',
    
    // Mock endpoints for development
    mockIncidents: [
        {
            id: 1,
            title: "Pothole on Main Street",
            description: "Large pothole causing traffic issues",
            category: "pothole",
            status: "pending",
            date: "2024-01-15T10:30:00",
            location: { lat: 40.7128, lng: -74.0060 },
            reporter: "John Doe",
            image: null
        },
        {
            id: 2,
            title: "Street Light Not Working",
            description: "Light has been out for 3 days",
            category: "streetlight",
            status: "in_progress",
            date: "2024-01-14T18:45:00",
            location: { lat: 40.7580, lng: -73.9855 },
            reporter: "Jane Smith",
            image: null
        },
        {
            id: 3,
            title: "Illegal Dumping in Park",
            description: "Garbage bags left near playground",
            category: "garbage",
            status: "resolved",
            date: "2024-01-12T14:20:00",
            location: { lat: 40.7489, lng: -73.9680 },
            reporter: "Admin",
            image: null
        }
    ],
    
    // Login
    login: async function(username, password) {
        console.log("API: Login attempt", username);
        
        // Mock login - in production, this would call WordPress JWT
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    token: 'mock_jwt_token_' + Date.now(),
                    user: {
                        id: 1,
                        username: username,
                        email: username + '@example.com'
                    }
                });
            }, 500);
        });
    },
    
    // Get all incidents
    getIncidents: async function(category = '') {
        console.log("API: Getting incidents", category);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                let incidents = [...this.mockIncidents];
                
                if (category) {
                    incidents = incidents.filter(inc => inc.category === category);
                }
                
                resolve({
                    success: true,
                    data: incidents
                });
            }, 800);
        });
    },
    
    // Report incident
    reportIncident: async function(incidentData) {
        console.log("API: Reporting incident", incidentData);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const newIncident = {
                    id: Date.now(),
                    title: incidentData.title,
                    description: incidentData.description,
                    category: incidentData.category || 'other',
                    status: 'pending',
                    date: new Date().toISOString(),
                    location: incidentData.location || null,
                    reporter: localStorage.getItem('username') || 'Anonymous',
                    image: incidentData.image || null
                };
                
                this.mockIncidents.unshift(newIncident);
                
                resolve({
                    success: true,
                    data: newIncident,
                    message: "Incident reported successfully!"
                });
            }, 1000);
        });
    },
    
    // Get user incidents
    getUserIncidents: async function() {
        const username = localStorage.getItem('username');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const userIncidents = this.mockIncidents.filter(
                    inc => inc.reporter === username
                );
                
                resolve({
                    success: true,
                    data: userIncidents
                });
            }, 600);
        });
    }
};

window.API = API;
console.log("Mock API module loaded");