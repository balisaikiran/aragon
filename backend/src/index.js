const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// In-memory storage
const users = [];
const boards = [];
const tasks = [];

// API Endpoints

// Create a new user
app.post('/users', (req, res) => {
  const { username, password, email } = req.body;

  // Simple validation
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required' });
  }

  // Create new user and push to in-memory array
  const newUser = { id: users.length + 1, username, password, email };
  users.push(newUser);

  return res.json(newUser);
});

// Get all boards for the authenticated user
app.get('/boards', (req, res) => {
  const { username } = req.body;

  // Filter boards by the creator's username
  const userBoards = boards.filter(board => board.creator_id === username);

  return res.json(userBoards);
});

// Get a specific board by id
app.get('/boards/:id', (req, res) => {
  const { id } = req.params;

  // Find board by ID
  const board = boards.find(board => board.id === parseInt(id));

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  return res.json(board);
});

// Create a new board
app.post('/boards', (req, res) => {
  const { name, creator_id } = req.body;

  // Create new board and push to in-memory array
  const newBoard = { id: boards.length + 1, name, creator_id, created_at: new Date() };
  boards.push(newBoard);

  return res.json(newBoard);
});

// Update an existing board
app.put('/boards/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Find and update board
  const board = boards.find(board => board.id === parseInt(id));

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  board.name = name;

  return res.json(board);
});

// Delete a board and its tasks
app.delete('/boards/:id', (req, res) => {
  const { id } = req.params;

  // Find and remove board
  const boardIndex = boards.findIndex(board => board.id === parseInt(id));

  if (boardIndex === -1) {
    return res.status(404).json({ message: 'Board not found' });
  }

  boards.splice(boardIndex, 1);

  // Also delete tasks associated with this board
  const remainingTasks = tasks.filter(task => task.board_id !== parseInt(id));
  tasks.length = 0;
  tasks.push(...remainingTasks);

  return res.json({ message: 'Board and associated tasks deleted successfully' });
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, board_id } = req.body;

  // Create new task and push to in-memory array
  const newTask = { id: tasks.length + 1, title, description, board_id, created_at: new Date(), status: 'todo' };
  tasks.push(newTask);

  return res.json(newTask);
});

// Get all tasks for a specific board
app.get('/tasks', (req, res) => {
  const { board_id } = req.body;

  // Filter tasks by board ID
  const boardTasks = tasks.filter(task => task.board_id === parseInt(board_id));

  return res.json(boardTasks);
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  // Find and update task
  const task = tasks.find(task => task.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.title = title;
  task.description = description;

  return res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  // Find and remove task
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);

  return res.json({ message: 'Task deleted successfully' });
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
