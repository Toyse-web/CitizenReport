const Map = {
    // Initialize map
    initMap: function() {
        const container = document.getElementById("map-container");
        if (!container) return;

        container.innerHTML = `
            <div style="height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                <div style="text-align: center; padding: 20px;">
                    <span class="material-icons" style="font-size: 80px;">map</span>
                    <h3>Interactive Map</h3>
                    <p>In production, this would show incidents on a real map</p>
                    
                    <div style="margin-top: 20px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                        <h4>Sample Incident Locations:</h4>
                        <ul style="text-align: left; list-style: none; padding: 0;">
                            <li>Pothole: 40.7128° N, 74.0060° W</li>
                            <li>Vandalism: 40.7580° N, 73.9855° W</li>
                            <li>Street Light: 40.7489° N, 73.9680° W</li>
                        </ul>
                    </div>
                    
                    <button class="btn-small" onclick="Map.centerOnUser()" style="margin-top: 20px;">
                        <span class="material-icons">my_location</span> Show My Location
                    </button>
                </div>
            </div>
        `;
    },
    
    // Refresh map
    refreshMap: function() {
        this.showSuccess("Map refreshed");
        this.initMap();
    },
    
    // Center on user location
    centerOnUser: function() {
        if (!navigator.geolocation) {
            this.showError("Geolocation not available");
            return;
        }
        
        this.showLoading("Getting your location...");
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                this.showSuccess(`Map centered on: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                
                const container = document.getElementById("map-container");
                if (container) {
                    container.innerHTML += `
                        <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: white; color: black; padding: 10px; border-radius: 8px; text-align: center;">
                            <p><strong>Your Location:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                        </div>
                    `;
                }
            },
            (error) => {
                this.showError("Failed to get location: " + error.message);
            }
        );
    },
    
    // Add marker for incident
    addMarker: function(lat, lng, title, description) {
        console.log(`Adding marker: ${title} at ${lat}, ${lng}`);
    },
    
    showLoading: function(message) {
        const container = document.getElementById("map-container");
        if (container) {
            const loader = document.createElement("div");
            loader.style.cssText = `
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px;
                z-index: 1000;
            `;
            loader.innerHTML = `
                <div class="spinner" style="margin: 0 auto 10px;"></div>
                <p>${message}</p>
            `;
            container.appendChild(loader);
        }
    },
    
    showError: function(message) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, "Map Error");
        } else {
            alert(message);
        }
    },
    
    showSuccess: function(message) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, "Success");
        } else {
            alert(message);
        }
    }
};

// Initialize map when map route is shown
document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("routechanged", function(event) {
        if (event.detail.path === "/map") {
            setTimeout(() => {
                Map.initMap();
            }, 300);
        }
    });
});

// Make Map globally available
window.Map = Map;
console.log("Map module loaded");