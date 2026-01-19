const Camera = {
    // Check if running on real device
    isDevice: function() {
        return typeof cordova !== 'undefined' && 
               cordova.platformId !== 'browser' &&
               navigator.camera;
    },
    
    // Take photo
    takePhoto: function() {
        console.log("📸 Take Photo clicked");
        this._getImage(1); // 1 = CAMERA
    },
    
    // Select from gallery
    selectFromGallery: function() {
        console.log("🖼️ Gallery clicked");
        this._getImage(2); // 2 = PHOTOLIBRARY
    },
    
    // Main function
    _getImage: function(sourceType) {
        console.log("Source type:", sourceType);
        
        // Use Cordova if on device
        if (this.isDevice()) {
            console.log("Using Cordova camera on device");
            this._useCordovaCamera(sourceType);
        } else {
            console.log("Using browser fallback");
            this._useBrowserFileInput(sourceType === 1);
        }
    },
    
    // Cordova camera
    _useCordovaCamera: function(sourceType) {
        const options = {
            quality: 80,
            destinationType: window.Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            encodingType: window.Camera.EncodingType.JPEG,
            correctOrientation: true,
            saveToPhotoAlbum: false
        };
        
        navigator.camera.getPicture(
            (imageData) => this._onSuccess(imageData),
            (error) => this._onError(error),
            options
        );
    },
    
    // Browser fallback
    _useBrowserFileInput: function(useCamera) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result.split(',')[1];
                    this._onSuccess(base64);
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    },
    
    // Success handler
    _onSuccess: function(imageData) {
        console.log("✅ Photo captured");
        
        // Update preview
        const preview = document.getElementById('photo-preview');
        if (preview) {
            preview.innerHTML = `
                <img src="data:image/jpeg;base64,${imageData}" 
                     style="max-width: 150px; border-radius: 8px;">
                <p style="color: green; font-size: 12px;">✓ Photo selected</p>
            `;
        }
        
        // Store data
        document.getElementById('photo-data').value = imageData;
        alert("Photo captured!");
    },
    
    // Error handler
    _onError: function(error) {
        console.error("Camera error:", error);
        alert("Camera error: " + error);
    },
    
    // Clear photo
    clearPhoto: function() {
        const preview = document.getElementById('photo-preview');
        if (preview) {
            preview.innerHTML = '<p>No photo selected</p>';
        }
        document.getElementById('photo-data').value = '';
    }
};

// Initialize
document.addEventListener('deviceready', function() {
    console.log("Device ready - Camera available:", !!navigator.camera);
}, false);

// Make available globally
window.Camera = Camera;
console.log("Camera module loaded");