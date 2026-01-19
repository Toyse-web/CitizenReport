const Incidents = {
    // Submit incident
    submitIncident: async function() {
        const title = document.getElementById('title')?.value;
        const description = document.getElementById('description')?.value;
        const category = document.getElementById('category')?.value;
        const latitude = document.getElementById('latitude')?.value;
        const longitude = document.getElementById('longitude')?.value;
        const photoData = document.getElementById('photo-data')?.value;
        
        if (!title || !description) {
            this.showError('Title and description are required');
            return;
        }
        
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Submitting...';
            submitBtn.disabled = true;
        }
        
        try {
            const incidentData = {
                title: title,
                description: description,
                category: category || 'other',
                location: latitude && longitude ? { lat: latitude, lng: longitude } : null,
                image: photoData || null
            };
            
            const result = await API.reportIncident(incidentData);
            
            if (result.success) {
                this.showSuccess(result.message);
                
                // Clear form
                document.getElementById('title').value = '';
                document.getElementById('description').value = '';
                document.getElementById('photo-preview').innerHTML = '<p>No photo selected</p>';
                document.getElementById('photo-data').value = '';
                
                router.navigate('/dashboard');
            }
        } catch (error) {
            this.showError('Failed to submit: ' + error.message);
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = 'Submit Report';
                submitBtn.disabled = false;
            }
        }
    },
    
    // Load incidents
    refreshIncidents: async function() {
        const container = document.getElementById('incidents-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading incidents...</p>
            </div>
        `;
        
        try {
            const category = document.getElementById('category-filter')?.value;
            const result = await API.getIncidents(category);
            
            if (result.success) {
                this.renderIncidents(result.data);
            }
        } catch (error) {
            container.innerHTML = `
                <div class="card">
                    <p style="color: red;">Error loading incidents: ${error.message}</p>
                </div>
            `;
        }
    },
    
    // Filter incidents
    filterIncidents: function() {
        this.refreshIncidents();
    },
    
    // Render incidents list
    renderIncidents: function(incidents) {
        const container = document.getElementById('incidents-container');
        if (!container) return;
        
        if (!incidents || incidents.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px 20px;">
                    <span class="material-icons" style="font-size: 60px; color: #ccc;">assignment</span>
                    <h3>No incidents found</h3>
                    <p>No reports in this category yet</p>
                    <button class="btn btn-primary" onclick="router.navigate('/report')">
                        Report First Incident
                    </button>
                </div>
            `;
            return;
        }
        
        let html = '<div class="incidents-list">';
        
        incidents.forEach(incident => {
            const date = new Date(incident.date);
            const statusColor = {
                pending: 'orange',
                in_progress: 'blue',
                resolved: 'green'
            }[incident.status] || 'gray';
            
            html += `
                <div class="card" style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4 style="margin: 0 0 8px 0; color: #333;">${incident.title}</h4>
                            <p style="margin: 0 0 8px 0; color: #666;">${incident.description}</p>
                        </div>
                        <span style="background: ${statusColor}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">
                            ${incident.status}
                        </span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #888;">
                        <span>📍 ${incident.category}</span>
                        <span>👤 ${incident.reporter}</span>
                        <span>📅 ${date.toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    showError: function(msg) {
        alert('❌ ' + msg);
    },
    
    showSuccess: function(msg) {
        alert('✅ ' + msg);
    }
};

// Auto-load incidents when page opens
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('routechanged', function(event) {
        if (event.detail.path === '/incidents') {
            setTimeout(() => {
                Incidents.refreshIncidents();
            }, 300);
        }
        
        if (event.detail.path === '/dashboard') {
            // Load recent incidents on dashboard
            setTimeout(() => {
                Incidents.loadDashboardIncidents();
            }, 500);
        }
    });
});

// Add this method
Incidents.loadDashboardIncidents = async function() {
    const container = document.getElementById('recent-list');
    if (!container) return;
    
    try {
        const result = await API.getIncidents();
        if (result.success && result.data.length > 0) {
            const recent = result.data.slice(0, 3); // Show 3 most recent
            let html = '';
            
            recent.forEach(incident => {
                html += `
                    <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                        <strong>${incident.title}</strong>
                        <div style="font-size: 12px; color: #666;">
                            ${incident.category} • ${new Date(incident.date).toLocaleDateString()}
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
};

window.Incidents = Incidents;