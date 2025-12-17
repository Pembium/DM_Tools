// World Map Module
// Handles all functionality related to the world map tab

// Initialize world map functionality
function initializeWorldMap() {
    const mapUpload = document.getElementById('mapUpload');
    const mapImage = document.getElementById('mapImage');
    const mapPlaceholder = document.getElementById('mapPlaceholder');

    // Handle map upload
    if (mapUpload) {
        mapUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    const imageData = event.target.result;
                    appState.mapData.imageUrl = imageData;
                    displayMap(imageData);
                    showNotification('Map uploaded successfully!', 'success');
                };
                
                reader.onerror = () => {
                    showNotification('Error uploading map', 'error');
                };
                
                reader.readAsDataURL(file);
            } else {
                showNotification('Please select a valid image file', 'error');
            }
        });
    }

    // Load existing map if available
    if (appState.mapData.imageUrl) {
        displayMap(appState.mapData.imageUrl);
    }

    console.log('World Map initialized');
}

// Display the map image
function displayMap(imageUrl) {
    const mapImage = document.getElementById('mapImage');
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    
    mapImage.src = imageUrl;
    mapImage.style.display = 'block';
    mapPlaceholder.style.display = 'none';
}

// Clear the current map
function clearMap() {
    if (confirm('Are you sure you want to clear the current map?')) {
        const mapImage = document.getElementById('mapImage');
        const mapPlaceholder = document.getElementById('mapPlaceholder');
        
        mapImage.style.display = 'none';
        mapImage.src = '';
        mapPlaceholder.style.display = 'block';
        
        appState.mapData.imageUrl = null;
        appState.mapData.locations = [];
        
        showNotification('Map cleared', 'success');
    }
}

// Add a location to the map
function addMapLocation() {
    const locationName = prompt('Enter location name:');
    if (!locationName) return;

    const x = prompt('Enter X coordinate:');
    const y = prompt('Enter Y coordinate:');
    
    const location = {
        id: Date.now(),
        name: locationName,
        x: parseFloat(x) || 0,
        y: parseFloat(y) || 0,
        description: prompt('Enter location description:') || ''
    };

    if (!appState.mapData.locations) {
        appState.mapData.locations = [];
    }

    appState.mapData.locations.push(location);
    renderMapLocations();
    showNotification(`Location "${locationName}" added!`, 'success');
}

// Render map locations
function renderMapLocations() {
    // Placeholder for rendering map locations
    // This will be implemented when you add a specific map library
    if (appState.mapData.locations && appState.mapData.locations.length > 0) {
        console.log('Map locations:', appState.mapData.locations);
    }
}

// Edit map settings
function editMapSettings() {
    showNotification('Map editing coming soon!', 'info');
    // Placeholder for map editing functionality
}

// Export world map functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWorldMap,
        addMapLocation,
        renderMapLocations,
        editMapSettings
    };
}
