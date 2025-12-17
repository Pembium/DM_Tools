// Main Application Script
// Core functionality for tab switching, save/load, and initialization

// Global State Management
const appState = {
    currentTab: 'world-map',
    npcs: [],
    notes: [],
    mapData: {}
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - starting initialization');
    initializeTabs();
    console.log('After initializeTabs');
    initializeSaveLoad();
    console.log('After initializeSaveLoad');
    initializeWorldMap();
    console.log('After initializeWorldMap');
    initializeNPCCards();
    console.log('After initializeNPCCards');
    initializeNotes();
    console.log('After initializeNotes');
    loadFromLocalStorage();
    console.log('Initialization complete');
});

// Tab Switching Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Initializing tabs:', tabButtons.length, 'buttons found');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            console.log('Tab clicked:', tabId);
            
            // Remove active class from all tabs and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            const tabContent = document.getElementById(tabId);
            console.log('Tab content element:', tabContent);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            appState.currentTab = tabId;
        });
    });
    
    console.log('Tabs initialized successfully');
}

// Save and Load Functionality
function initializeSaveLoad() {
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');

    if (saveBtn) {
        saveBtn.addEventListener('click', saveSession);
    }
    if (loadBtn) {
        loadBtn.addEventListener('click', loadSession);
    }
}

function saveSession() {
    try {
        localStorage.setItem('dmToolsSession', JSON.stringify(appState));
        showNotification('Session saved successfully!', 'success');
    } catch (error) {
        showNotification('Error saving session', 'error');
        console.error('Save error:', error);
    }
}

function loadSession() {
    try {
        const savedData = localStorage.getItem('dmToolsSession');
        if (savedData) {
            const loadedState = JSON.parse(savedData);
            Object.assign(appState, loadedState);
            
            // Refresh UI with loaded data
            renderNPCs();
            renderNotes();
            renderMapLocations();
            
            showNotification('Session loaded successfully!', 'success');
        } else {
            showNotification('No saved session found', 'info');
        }
    } catch (error) {
        showNotification('Error loading session', 'error');
        console.error('Load error:', error);
    }
}

function loadFromLocalStorage() {
    // Auto-load on startup
    const savedData = localStorage.getItem('dmToolsSession');
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            Object.assign(appState, loadedState);
            
            // Only render if DOM is ready
            if (document.getElementById('npcCardsContainer')) {
                renderNPCs();
            }
            if (document.getElementById('notesContainer')) {
                renderNotes();
            }
            if (document.getElementById('mapImage')) {
                renderMapLocations();
            }
        } catch (error) {
            console.error('Error auto-loading session:', error);
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    // Set background color based on type
    const colors = {
        success: '#48bb78',
        error: '#f56565',
        info: '#4299e1'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
