// Notes Module
// Handles all functionality related to note-taking

// Initialize Notes functionality
function initializeNotes() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const cancelNoteBtn = document.getElementById('cancelNoteBtn');
    
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', showNoteForm);
    }
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', saveNewNote);
    }
    if (cancelNoteBtn) {
        cancelNoteBtn.addEventListener('click', hideNoteForm);
    }
}

// Show the note form
function showNoteForm() {
    const formContainer = document.getElementById('noteFormContainer');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteDate = document.getElementById('noteDate');
    
    // Set default date to today
    noteDate.value = new Date().toISOString().split('T')[0];
    
    formContainer.style.display = 'block';
    addNoteBtn.style.display = 'none';
}

// Hide the note form
function hideNoteForm() {
    const formContainer = document.getElementById('noteFormContainer');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const titleInput = document.getElementById('noteTitle');
    const dateInput = document.getElementById('noteDate');
    const contentInput = document.getElementById('noteContent');
    
    // Clear form
    titleInput.value = '';
    dateInput.value = '';
    contentInput.value = '';
    
    formContainer.style.display = 'none';
    addNoteBtn.style.display = 'block';
}

// Save new note
function saveNewNote() {
    const titleInput = document.getElementById('noteTitle');
    const dateInput = document.getElementById('noteDate');
    const contentInput = document.getElementById('noteContent');
    
    const title = titleInput.value.trim() || 'Untitled Note';
    const sessionDate = dateInput.value;
    const content = contentInput.value.trim();
    
    const note = {
        id: Date.now(),
        title: title,
        sessionDate: sessionDate,
        content: content,
        timestamp: new Date().toLocaleString()
    };
    
    // Add to beginning of array so it appears at top
    appState.notes.unshift(note);
    renderNotes();
    hideNoteForm();
    showNotification('Note saved!', 'success');
}

// Render all notes
function renderNotes() {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';

    if (appState.notes.length === 0) {
        container.innerHTML = '<p style="color: #999;">No notes yet. Click "Add New Note" to create one.</p>';
        return;
    }

    appState.notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `
            <h3>${escapeHtml(note.title || 'Untitled Note')}</h3>
            <div class="note-date"><strong>Session Date:</strong> ${escapeHtml(note.sessionDate || 'N/A')}</div>
            <div class="note-content">${escapeHtml(note.content || '')}</div>
            <small style="color: #666;">${escapeHtml(note.timestamp)}</small>
            <div class="note-actions">
                <button class="btn btn-small" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        `;
        container.appendChild(noteItem);
    });
}

// Delete a note
function deleteNote(id) {
    const note = appState.notes.find(n => n.id === id);
    if (note && confirm(`Are you sure you want to delete "${note.title}"?`)) {
        appState.notes = appState.notes.filter(n => n.id !== id);
        renderNotes();
        showNotification('Note deleted!', 'success');
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export notes functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNotes,
        showNoteForm,
        hideNoteForm,
        saveNewNote,
        renderNotes,
        deleteNote
    };
}
