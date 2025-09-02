const saveButton = document.querySelector('#btnSave');
const deleteButton = document.querySelector('#btnDelete');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const notesContainer = document.querySelector('#notes__container');


function clearForm() {
    titleInput.value = '';
    descriptionInput.value = '';
    deleteButton.setAttribute('hidden', true);
}
function displayNoteInForm(note) {
    titleInput.value = note.title;
    descriptionInput.value = note.description;
    deleteButton.removeAttribute('hidden');
    deleteButton.setAttribute('data-id', note.id);
    saveButton.setAttribute('data-id', note.id);
}
function displayNotes(notes) {
    let allNotes = '';

    notes.forEach(note => {
        const noteElement = `
            <div class="note" data-id="${note.id}">
                <h3>${note.title}</h3>
                <p>${note.description}</p>
            </div>
        `;
        allNotes += noteElement;
    });
    notesContainer.innerHTML = allNotes;

    document.querySelectorAll('.note').forEach(note => {
        note.addEventListener('click', function () {
            getNoteById(note.dataset.id);
        });
    });
}

function addNote(title, description) {
    const body = {
        title: title,
        description: description,
        isVisible: true
    }

    fetch(`https://localhost:7174/api/notes`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            response.json()
            clearForm();
            getAllNotes();
        })
}
function getNoteById(id) {
    fetch(`https://localhost:7174/api/notes/${id}`)
        .then(data => data.json())
        .then(response => displayNoteInForm(response));
}
function updateNote(id, title, description) {
    const body = {
        title: title,
        description: description,
        isVisible: true
    }

    fetch(`https://localhost:7174/api/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            response.json()
            clearForm();
            getAllNotes();
        })
}
function getAllNotes() {
    fetch(`https://localhost:7174/api/notes`)
        .then(data => data.json())
        .then(response => displayNotes(response));
}
function deleteNote(id) {
    fetch(`https://localhost:7174/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log(response);
            clearForm();
            getAllNotes();
        });
}

saveButton.addEventListener('click', () => {
    const id = saveButton.dataset.id;
    if (id) {
        updateNote(id, titleInput.value, descriptionInput.value);
    } else {
        addNote(titleInput.value, descriptionInput.value);
    }
});
deleteButton.addEventListener('click', () => {
    const id = deleteButton.dataset.id;
    deleteNote(id);
});

getAllNotes();