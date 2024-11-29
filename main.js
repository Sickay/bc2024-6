const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Доданий імпорт path
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'); // Доданий імпорт swagger-ui-express

const app = express();
const port = 3000;

// Swagger налаштування
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notes API',
            version: '1.0.0',
            description: 'API для роботи з нотатками',
        },
    },
    apis: [__filename], // Аналізує цей файл для JSDoc коментарів
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger документація

// Middleware для обробки запитів
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Обробка JSON
app.use(express.static(path.join(__dirname, 'public'))); // Статичні файли

// Система зберігання нотаток (тимчасова)
let notes = {};

// 1. GET /notes/:noteName
/**
 * @swagger
 * /notes/{noteName}:
 *   get:
 *     summary: Отримати нотатку за назвою
 *     parameters:
 *       - in: path
 *         name: noteName
 *         required: true
 *         description: Назва нотатки
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішне отримання нотатки
 *       404:
 *         description: Нотатку не знайдено
 */
app.get('/notes/:noteName', (req, res) => {
    const noteName = req.params.noteName;
    if (notes[noteName]) {
        res.status(200).send(notes[noteName]);
    } else {
        res.status(404).send('Not Found');
    }
});

// 2. PUT /notes/:noteName
/**
 * @swagger
 * /notes/{noteName}:
 *   put:
 *     summary: Оновити нотатку за назвою
 *     parameters:
 *       - in: path
 *         name: noteName
 *         required: true
 *         description: Назва нотатки
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Новий текст нотатки
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Нотатку оновлено
 *       404:
 *         description: Нотатку не знайдено
 */
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
/**
 * @swagger
 * /notes/{noteName}:
 *   delete:
 *     summary: Видалити нотатку за назвою
 *     parameters:
 *       - in: path
 *         name: noteName
 *         required: true
 *         description: Назва нотатки
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Нотатку видалено
 *       404:
 *         description: Нотатку не знайдено
 */
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
/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Отримати всі нотатки
 *     responses:
 *       200:
 *         description: Успішне отримання списку нотаток
 */
app.get('/notes', (req, res) => {
    const notesList = Object.keys(notes).map(name => ({ name, text: notes[name] }));
    res.status(200).json(notesList);
});

// 5. POST /write
/**
 * @swagger
 * /write:
 *   post:
 *     summary: Створити нову нотатку
 *     requestBody:
 *       description: Назва та текст нотатки
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note_name:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Нотатку створено
 *       400:
 *         description: Нотатка вже існує
 */
app.post('/write', (req, res) => {
    const { note_name, note } = req.body;
    if (notes[note_name]) {
        res.status(400).send('Bad Request');
    } else {
        notes[note_name] = note;
        res.status(201).send('Created');
    }
});

// 6. GET /
/**
 * @swagger
 * /:
 *   get:
 *     summary: Повертає форму для завантаження
 *     responses:
 *       200:
 *         description: Успішно повернуто форму
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'UploadForm.html'));
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
