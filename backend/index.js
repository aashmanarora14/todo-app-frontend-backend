const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());


// simple in-memory store
let todos = [];
let idCounter = 1;


app.get('/api/health', (req, res) => res.json({ status: 'ok' }));


app.get('/api/todos', (req, res) => {
res.json(todos);
});


app.post('/api/todos', (req, res) => {
const { title } = req.body;
if (!title) return res.status(400).json({ error: 'title required' });
const todo = { id: idCounter++, title, done: false };
todos.push(todo);
res.status(201).json(todo);
});


app.put('/api/todos/:id', (req, res) => {
const id = Number(req.params.id);
const { title, done } = req.body;
const todo = todos.find(t => t.id === id);
if (!todo) return res.status(404).json({ error: 'not found' });
if (title !== undefined) todo.title = title;
if (done !== undefined) todo.done = done;
res.json(todo);
});


app.delete('/api/todos/:id', (req, res) => {
const id = Number(req.params.id);
const before = todos.length;
todos = todos.filter(t => t.id !== id);
res.status(204).send();
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));