// Notes Module
// Handles all functionality related to note-taking

// Initialize Notes functionality
function initializeNotes() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    addNoteBtn.addEventListener('click', addNote);
}

// Add a new note
function addNote() {
    const note = {
        id: Date.now(),
        title: prompt('Enter note title:') || 'Untitled Note',
        content: prompt('Enter note content:') || '',
        timestamp: new Date().toLocaleString()
    };

    appState.notes.push(note);
    renderNotes();
    showNotification(`Note "${note.title}" created!`, 'success');
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
            <h3>${escapeHtml(note.title)}</h3>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <small style="color: #666;">${escapeHtml(note.timestamp)}</small>
            <div class="note-actions">
                <button class="btn btn-small" onclick="editNote(${note.id})">Edit</button>
                <button class="btn btn-small" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        `;
        container.appendChild(noteItem);
    });
}

// Edit an existing note
function editNote(id) {
    const note = appState.notes.find(n => n.id === id);
    if (note) {
        note.title = prompt('Edit title:', note.title) || note.title;
        note.content = prompt('Edit content:', note.content) || note.content;
        note.timestamp = new Date().toLocaleString();
        renderNotes();
        showNotification('Note updated!', 'success');
    }
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
        addNote,
        renderNotes,
        editNote,
        deleteNote
    };
}
