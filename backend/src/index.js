const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// In-memory storage
const users = [];
const boards = [];
const tasks = [];

// JWT secret key (replace with a secure, environment-specific secret in production)
const JWT_SECRET = 'your_jwt_secret';

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// API Endpoints

// Create a new user (signup)
app.post('/users', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required' });
  }

  const newUser = { id: users.length + 1, username, password, email };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);
  return res.json({ user: newUser, token });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  return res.json({ user, token });
});

// Apply authMiddleware to protected routes
app.use('/boards', authMiddleware);
app.use('/tasks', authMiddleware);

// Get all boards for the authenticated user
app.get('/boards', (req, res) => {
  const userBoards = boards.filter(board => board.creator_id === req.user.id);
  return res.json(userBoards);
});

// Get a specific board by id
app.get('/boards/:id', (req, res) => {
  const { id } = req.params;
  const board = boards.find(board => board.id === parseInt(id) && board.creator_id === req.user.id);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  return res.json(board);
});

// Create a new board
app.post('/boards', (req, res) => {
  const { name } = req.body;
  const newBoard = { id: boards.length + 1, name, creator_id: req.user.id, created_at: new Date() };
  boards.push(newBoard);
  return res.json(newBoard);
});

// Update an existing board
app.put('/boards/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const board = boards.find(board => board.id === parseInt(id) && board.creator_id === req.user.id);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  board.name = name;
  return res.json(board);
});

// Delete a board and its tasks
app.delete('/boards/:id', (req, res) => {
  const { id } = req.params;
  const boardIndex = boards.findIndex(board => board.id === parseInt(id) && board.creator_id === req.user.id);

  if (boardIndex === -1) {
    return res.status(404).json({ message: 'Board not found' });
  }

  boards.splice(boardIndex, 1);
  const remainingTasks = tasks.filter(task => task.board_id !== parseInt(id));
  tasks.length = 0;
  tasks.push(...remainingTasks);

  return res.json({ message: 'Board and associated tasks deleted successfully' });
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, board_id } = req.body;
  const newTask = { id: tasks.length + 1, title, description, board_id, created_at: new Date(), status: 'todo' };
  tasks.push(newTask);
  return res.json(newTask);
});

// Get all tasks for a specific board
app.get('/tasks', (req, res) => {
  const { board_id } = req.query;
  const boardTasks = tasks.filter(task => task.board_id === parseInt(board_id));
  return res.json(boardTasks);
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
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
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  return res.json({ message: 'Task deleted successfully' });
});

app.use(express.static('build'));

// Fallback route for React Router to handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});