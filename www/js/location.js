const Location = {
    // Get current location
    getCurrentLocation: function() {
        if (!navigator.geolocation) {
            this.showError("Geolocation not available");
            return;
        }
        
        const locationInfo = document.getElementById("location-info");
        if (locationInfo) {
            locationInfo.innerHTML = `
                <p><span class="material-icons" style="vertical-align: middle;">location_searching</span> 
                Getting location...</p>
            `;
        }
        
        // Get position
        navigator.geolocation.getCurrentPosition(
            this.onLocationSuccess.bind(this),
            this.onLocationError.bind(this),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    },
    
    onLocationSuccess: function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        console.log(`Location captured: ${lat}, ${lng} (accuracy: ${accuracy}m)`);
        
        // Update form fields
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lng;
        
        // Update UI
        const locationInfo = document.getElementById("location-info");
        if (locationInfo) {
            locationInfo.innerHTML = `
                <p style="color: green;">
                    <span class="material-icons" style="vertical-align: middle; color: green;">location_on</span>
                    Location captured!
                </p>
                <p style="font-size: 12px; color: #666;">
                    Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}<br>
                    Accuracy: ${Math.round(accuracy)} meters
                </p>
                <button class="btn-small" onclick="Location.getCurrentLocation()">
                    <span class="material-icons">refresh</span> Update Location
                </button>
            `;
        }
        
        this.showSuccess("Location captured successfully!");
    },
    
    // Location error callback
    onLocationError: function(error) {
        console.error("Location error:", error);
        
        const errorMessages = {
            1: "Permission denied. Please enable location services.",
            2: "Position unavailable. Try again later.",
            3: "Request timeout. Check your connection."
        };
        
        const message = errorMessages[error.code] || "Failed to get location: " + error.message;
        
        // Update UI
        const locationInfo = document.getElementById("location-info");
        if (locationInfo) {
            locationInfo.innerHTML = `
                <p style="color: red;">
                    <span class="material-icons" style="vertical-align: middle; color: red;">location_off</span>
                    ${message}
                </p>
                <button class="btn-small" onclick="Location.getCurrentLocation()">
                    <span class="material-icons">my_location</span> Try Again
                </button>
            `;
        }
        
        this.showError(message);
    },
    
    // Watch position continuously
    watchPosition: function(callback) {
        if (!navigator.geolocation) return null;
        
        return navigator.geolocation.watchPosition(
            callback,
            this.onLocationError.bind(this),
            { enableHighAccuracy: true }
        );
    },
    
    // Clear watch
    clearWatch: function(watchId) {
        if (watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
        }
    },
    
    showError: function(message) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, "Location Error");
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

// Make Location globally available
window.Location = Location;
console.log("Location module loaded");