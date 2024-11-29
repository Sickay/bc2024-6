const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Система зберігання нотаток (тимчасова)
let notes = {};

// Middleware для обробки тіла запиту в форматі JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Статичні файли, наприклад, HTML, CSS, JavaScript
app.use(express.static(path.join(__dirname, 'public')));

// 1. GET /notes/:noteName
app.get('/notes/:noteName', (req, res) => {
    const noteName = req.params.noteName;
    if (notes[noteName]) {
        res.status(200).send(notes[noteName]);
    } else {
        res.status(404).send('Not Found');
    }
});

// 2. PUT /notes/:noteName
app.put('/notes/:noteName', (req, res) => {
    const noteName = req.params.noteName;
    if (notes[noteName]) {
        notes[noteName] = req.body.text;
        res.status(200).send(notes[noteName]);
    } else {
        res.status(404).send('Not Found');
    }
});

// 3. DELETE /notes/:noteName
app.delete('/notes/:noteName', (req, res) => {
    const noteName = req.params.noteName;
    if (notes[noteName]) {
        delete notes[noteName];
        res.status(200).send('Deleted');
    } else {
        res.status(404).send('Not Found');
    }
});

// 4. GET /notes
app.get('/notes', (req, res) => {
    const notesList = Object.keys(notes).map(name => ({ name, text: notes[name] }));
    res.status(200).json(notesList);
});

// 5. POST /write
app.post('/write', (req, res) => {
    const { note_name, note } = req.body;
    if (notes[note_name]) {
        res.status(400).send('Bad Request');
    } else {
        notes[note_name] = note;
        res.status(201).send('Created');
    }
});

// 6. GET /UploadForm.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'UploadForm.html'));
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
