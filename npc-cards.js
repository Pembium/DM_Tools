// NPC Cards Module
// Handles all functionality related to NPC character cards

// Initialize NPC Cards functionality
function initializeNPCCards() {
    const addNpcBtn = document.getElementById('addNpcBtn');
    if (addNpcBtn) {
        addNpcBtn.addEventListener('click', addNPC);
    }
    
    // Event delegation for dynamically created buttons
    const container = document.getElementById('npcCardsContainer');
    if (container) {
        container.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.classList.contains('save-npc-btn')) {
                const id = parseInt(target.dataset.id);
                saveNPC(id);
            } else if (target.classList.contains('edit-npc-btn')) {
                const id = parseInt(target.dataset.id);
                editNPC(id);
            } else if (target.classList.contains('delete-npc-btn')) {
                const id = parseInt(target.dataset.id);
                deleteNPC(id);
            } else if (target.classList.contains('toggle-status-btn')) {
                const id = parseInt(target.dataset.id);
                toggleStatus(id);
            }
        });
    }
}

// Add a new NPC
function addNPC() {
    const npc = {
        id: Date.now(),
        name: '',
        race: '',
        class: '',
        description: '',
        status: 'alive',
        isEditing: true
    };

    appState.npcs.push(npc);
    renderNPCs();
    showNotification('New NPC card created. Fill in the details!', 'info');
}

// Render all NPC cards
function renderNPCs() {
    const container = document.getElementById('npcCardsContainer');
    container.innerHTML = '';

    if (appState.npcs.length === 0) {
        container.innerHTML = '<p style="color: #999;">No NPCs yet. Click "Add New NPC" to create one.</p>';
        return;
    }

    appState.npcs.forEach(npc => {
        const card = document.createElement('div');
        card.className = 'npc-card';
        
        if (npc.isEditing) {
            // Render editable card
            card.innerHTML = `
                <input type="text" id="name-${npc.id}" class="npc-input" placeholder="Enter NPC name" value="${escapeHtml(npc.name || '')}">
                <input type="text" id="race-${npc.id}" class="npc-input" placeholder="Enter race" value="${escapeHtml(npc.race || '')}">
                <input type="text" id="class-${npc.id}" class="npc-input" placeholder="Enter class" value="${escapeHtml(npc.class || '')}">
                <textarea id="desc-${npc.id}" class="npc-textarea" placeholder="Enter description">${escapeHtml(npc.description || '')}</textarea>
                <div class="status-selector">
                    <label><strong>Status:</strong></label>
                    <select id="status-${npc.id}" class="npc-select">
                        <option value="alive" ${npc.status === 'alive' ? 'selected' : ''}>Alive</option>
                        <option value="dead" ${npc.status === 'dead' ? 'selected' : ''}>Dead</option>
                    </select>
                </div>
                <div class="card-actions">
                    <button class="btn btn-small btn-primary save-npc-btn" data-id="${npc.id}">Save</button>
                    <button class="btn btn-small delete-npc-btn" data-id="${npc.id}">Delete</button>
                </div>
            `;
        } else {
            // Render display card
            const statusClass = npc.status === 'dead' ? 'npc-dead' : '';
            if (statusClass) {
                card.classList.add(statusClass);
            }
            card.innerHTML = `
                <div class="npc-status-badge ${npc.status}">${npc.status === 'alive' ? '✓ Alive' : '✗ Dead'}</div>
                <h3>${escapeHtml(npc.name || 'Unnamed NPC')}</h3>
                <p><strong>Race:</strong> ${escapeHtml(npc.race || 'Unknown')}</p>
                <p><strong>Class:</strong> ${escapeHtml(npc.class || 'Unknown')}</p>
                <p><strong>Description:</strong> ${escapeHtml(npc.description || 'No description')}</p>
                <div class="card-actions">
                    <button class="btn btn-small toggle-status-btn" data-id="${npc.id}">Toggle Status</button>
                    <button class="btn btn-small edit-npc-btn" data-id="${npc.id}">Edit</button>
                    <button class="btn btn-small delete-npc-btn" data-id="${npc.id}">Delete</button>
                </div>
            `;
        }
        
        container.appendChild(card);
    });
}

// Save NPC from editing mode
function saveNPC(id) {
    const npc = appState.npcs.find(n => n.id === id);
    if (npc) {
        npc.name = document.getElementById(`name-${id}`).value;
        npc.race = document.getElementById(`race-${id}`).value;
        npc.class = document.getElementById(`class-${id}`).value;
        npc.description = document.getElementById(`desc-${id}`).value;
        npc.status = document.getElementById(`status-${id}`).value;
        npc.isEditing = false;
        renderNPCs();
        showNotification('NPC saved!', 'success');
    }
}

// Toggle NPC status between alive and dead
function toggleStatus(id) {
    const npc = appState.npcs.find(n => n.id === id);
    if (npc) {
        npc.status = npc.status === 'alive' ? 'dead' : 'alive';
        renderNPCs();
        showNotification(`NPC marked as ${npc.status}!`, 'info');
    }
}

// Edit an existing NPC
function editNPC(id) {
    const npc = appState.npcs.find(n => n.id === id);
    if (npc) {
        npc.isEditing = true;
        renderNPCs();
    }
}

// Delete an NPC
function deleteNPC(id) {
    const npc = appState.npcs.find(n => n.id === id);
    if (npc && confirm(`Are you sure you want to delete "${npc.name}"?`)) {
        appState.npcs = appState.npcs.filter(n => n.id !== id);
        renderNPCs();
        showNotification('NPC deleted!', 'success');
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export NPC functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNPCCards,
        addNPC,
        renderNPCs,
        editNPC,
        deleteNPC
    };
}
