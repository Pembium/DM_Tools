// World Map Module
// Handles all functionality related to the world map tab

// State for tracking marker placement mode
let isPlacingMarker = false;
let selectedMarkerId = null;

// Initialize world map functionality
function initializeWorldMap() {
    const mapUpload = document.getElementById('mapUpload');
    const mapImage = document.getElementById('mapImage');
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    const mapCanvas = document.getElementById('mapCanvas');

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

    // Handle map canvas clicks for marker placement
    if (mapCanvas) {
        mapCanvas.addEventListener('click', (e) => {
            if (!isPlacingMarker) return;

            const mapImage = document.getElementById('mapImage');
            if (!mapImage.src) return;

            // Get image position and dimensions
            const imgRect = mapImage.getBoundingClientRect();
            const canvasRect = mapCanvas.getBoundingClientRect();

            // Calculate click position relative to the image
            const x = e.clientX - imgRect.left;
            const y = e.clientY - imgRect.top;

            // Check if click is within image bounds
            if (x < 0 || y < 0 || x > imgRect.width || y > imgRect.height) {
                showNotification('Please click on the map image', 'info');
                return;
            }

            const locationName = prompt('Enter location name:');
            if (!locationName) return;

            // Normalize coordinates to image size so markers stay aligned when scaling
            const xPct = x / imgRect.width;
            const yPct = y / imgRect.height;

            const location = {
                id: Date.now(),
                name: locationName,
                xPct: xPct,
                yPct: yPct,
                description: prompt('Enter location description:') || ''
            };

            if (!appState.mapData.locations) {
                appState.mapData.locations = [];
            }

            // Record base dimensions for any legacy markers or reference
            appState.mapData.baseWidth = imgRect.width;
            appState.mapData.baseHeight = imgRect.height;

            appState.mapData.locations.push(location);
            renderMapLocations();
            showNotification(`Location "${locationName}" added at coordinates!`, 'success');
            
            isPlacingMarker = false;
            updateAddLocationButtonState();
            document.getElementById('mapCanvas').classList.remove('placing-marker');
        });
    }

    // Re-render markers when window resizes (image may scale)
    window.addEventListener('resize', () => {
        renderMapLocations();
    });

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

    // Ensure base dimensions and markers render after image loads
    mapImage.onload = () => {
        const rect = mapImage.getBoundingClientRect();
        if (!appState.mapData) appState.mapData = {};
        if (!appState.mapData.locations) appState.mapData.locations = [];
        appState.mapData.baseWidth = rect.width;
        appState.mapData.baseHeight = rect.height;
        renderMapLocations();
    };
}

// Delete a specific marker by ID
function deleteMarker(id) {
    const marker = appState.mapData.locations.find(m => m.id === id);
    if (marker && confirm(`Delete marker "${marker.name}"?`)) {
        appState.mapData.locations = appState.mapData.locations.filter(m => m.id !== id);
        selectedMarkerId = null;
        renderMapLocations();
        showNotification(`Marker "${marker.name}" deleted`, 'success');
    }
}

// Toggle marker selection for deletion
function toggleMarkerSelection(id) {
    if (selectedMarkerId === id) {
        selectedMarkerId = null;
    } else {
        selectedMarkerId = id;
    }
    renderMapLocations();
}

// Clear map markers only (keep image)
function clearMapMarkers() {
    if (appState.mapData.locations && appState.mapData.locations.length > 0) {
        if (confirm('Are you sure you want to clear all markers?')) {
            appState.mapData.locations = [];
            renderMapLocations();
            showNotification('All markers cleared', 'success');
        }
    } else {
        showNotification('No markers to clear', 'info');
    }
}

// Delete the entire map (image and markers)
function deleteMap() {
    if (confirm('⚠️  WARNING: This will permanently delete the entire map image and all markers. Continue?')) {
        const mapImage = document.getElementById('mapImage');
        const mapPlaceholder = document.getElementById('mapPlaceholder');
        
        mapImage.style.display = 'none';
        mapImage.src = '';
        mapPlaceholder.style.display = 'block';
        
        appState.mapData.imageUrl = null;
        appState.mapData.locations = [];
        
        isPlacingMarker = false;
        updateAddLocationButtonState();
        
        showNotification('Map deleted', 'success');
    }
}

// Toggle marker placement mode
function addMapLocation() {
    const mapImage = document.getElementById('mapImage');
    if (!mapImage.src) {
        showNotification('Please upload a map first', 'info');
        return;
    }

    isPlacingMarker = !isPlacingMarker;
    updateAddLocationButtonState();
    
    if (isPlacingMarker) {
        showNotification('Click on the map to place a marker', 'info');
        document.getElementById('mapCanvas').classList.add('placing-marker');
    } else {
        showNotification('Marker placement cancelled', 'info');
        document.getElementById('mapCanvas').classList.remove('placing-marker');
    }
}

// Update Add Location button appearance based on state
function updateAddLocationButtonState() {
    const addLocationBtn = document.querySelector('button[onclick="addMapLocation()"]');
    if (addLocationBtn) {
        if (isPlacingMarker) {
            addLocationBtn.textContent = 'Cancel Marker Placement';
            addLocationBtn.style.backgroundColor = '#f56565';
        } else {
            addLocationBtn.textContent = 'Add Location';
            addLocationBtn.style.backgroundColor = '';
        }
    }
}

// Render map locations as markers on the map
function renderMapLocations() {
    const mapCanvas = document.getElementById('mapCanvas');
    const mapImage = document.getElementById('mapImage');
    
    // Remove existing SVG overlay if present
    const existingSvg = mapCanvas.querySelector('svg');
    if (existingSvg) {
        existingSvg.remove();
    }

    // Only render if map image exists
    if (!mapImage.src || !appState.mapData.locations || appState.mapData.locations.length === 0) {
        return;
    }

    // Get actual image dimensions
    const imgRect = mapImage.getBoundingClientRect();
    const canvasRect = mapCanvas.getBoundingClientRect();
    
    // Create SVG overlay positioned exactly over the image
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', imgRect.width);
    svg.setAttribute('height', imgRect.height);
    svg.style.position = 'absolute';
    svg.style.top = (imgRect.top - canvasRect.top) + 'px';
    svg.style.left = (imgRect.left - canvasRect.left) + 'px';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '10';

    // Draw each location marker
    appState.mapData.locations.forEach((location, index) => {
        const markerRadius = 8;
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
        const color = colors[index % colors.length];

        // Compute screen coordinates from normalized or legacy pixel values
        let sx, sy;
        if (typeof location.xPct === 'number' && typeof location.yPct === 'number') {
            sx = location.xPct * imgRect.width;
            sy = location.yPct * imgRect.height;
        } else if (typeof location.x === 'number' && typeof location.y === 'number') {
            const baseW = appState.mapData.baseWidth || imgRect.width;
            const baseH = appState.mapData.baseHeight || imgRect.height;
            sx = (location.x / baseW) * imgRect.width;
            sy = (location.y / baseH) * imgRect.height;
        } else {
            return; // skip malformed marker
        }

        const isSelected = selectedMarkerId === location.id;
        const markerStroke = isSelected ? '#ffff00' : 'white';
        const markerStrokeWidth = isSelected ? '3' : '2';

        // Draw marker circle (clickable group)
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.style.cursor = 'pointer';
        g.style.pointerEvents = 'auto';
        g.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMarkerSelection(location.id);
        });

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', sx);
        circle.setAttribute('cy', sy);
        circle.setAttribute('r', markerRadius);
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', markerStroke);
        circle.setAttribute('stroke-width', markerStrokeWidth);
        circle.setAttribute('opacity', '0.9');
        g.appendChild(circle);

        // Draw marker label background
        const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        labelBg.setAttribute('x', sx + markerRadius + 5);
        labelBg.setAttribute('y', sy - 15);
        labelBg.setAttribute('width', location.name.length * 5 + 8);
        labelBg.setAttribute('height', '20');
        labelBg.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
        labelBg.setAttribute('rx', '3');
        g.appendChild(labelBg);

        // Draw marker label text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', sx + markerRadius + 9);
        text.setAttribute('y', sy - 2);
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.textContent = location.name;
        g.appendChild(text);

        // Draw delete button if selected
        if (isSelected) {
            const deleteBtn = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            deleteBtn.setAttribute('cx', sx);
            deleteBtn.setAttribute('cy', sy - 20);
            deleteBtn.setAttribute('r', 6);
            deleteBtn.setAttribute('fill', '#f56565');
            deleteBtn.setAttribute('stroke', 'white');
            deleteBtn.setAttribute('stroke-width', '1');
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMarker(location.id);
            });
            g.appendChild(deleteBtn);

            // Draw X on delete button
            const xLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            xLine1.setAttribute('x1', sx - 2);
            xLine1.setAttribute('y1', sy - 22);
            xLine1.setAttribute('x2', sx + 2);
            xLine1.setAttribute('y2', sy - 18);
            xLine1.setAttribute('stroke', 'white');
            xLine1.setAttribute('stroke-width', '1.5');
            xLine1.style.pointerEvents = 'none';
            g.appendChild(xLine1);

            const xLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            xLine2.setAttribute('x1', sx + 2);
            xLine2.setAttribute('y1', sy - 22);
            xLine2.setAttribute('x2', sx - 2);
            xLine2.setAttribute('y2', sy - 18);
            xLine2.setAttribute('stroke', 'white');
            xLine2.setAttribute('stroke-width', '1.5');
            xLine2.style.pointerEvents = 'none';
            g.appendChild(xLine2);
        }

        svg.appendChild(g);
    });

    mapCanvas.appendChild(svg);
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
        clearMapMarkers,
        deleteMap,
        renderMapLocations,
        editMapSettings
    };
}
