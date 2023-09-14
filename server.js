// Import required library
const express = require('express');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');

// Import of array of notes
const notes = require('./db/db.json');

// Middlware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Define route to get notes
app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

// Define route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Define catch all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to create new note and updates file
function createNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray)) {
        notesArray = [];
    }

    if (notesArray.length === 0) {
        notesArray.push(0);
    }

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2));
    return newNote;
}

// Define a route for POST requests after creating notes
app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, notes);
    res.json(newNote);
});

// Function to delete note by ID
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2));

            break;
        }
    }
}

// Define route to handle delete requests
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

// Starting server and listening for port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});