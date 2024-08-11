const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: 'testdb_owner',
  host: 'ep-tiny-recipe-a4gl515p.us-east-1.aws.neon.tech',
  database: 'testdb',
  password: 'c5WOBxo0yEdp',
  port: 5432,
});

// API Endpoints

// Create a new user
// app.post('/users', (req, res) => {
//   const { username, email } = req.body;
//   pool.query(
//     `INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *`,
//     [username, email],
//     (err, result) => {
//       if (err) {
//         console.error('Error creating user:', err);
//         return res.status(500).json({ message: 'Error creating user', error: err });
//       }
//       return res.json(result.rows[0]);
//     }
//   );
// });

// new version
// app.post('/users', (req, res) => {
//     const { username, password, email } = req.body;
  
//     // Simple validation
//     if (!username || !password || !email) {
//       return res.status(400).json({ message: 'Username, password, and email are required' });
//     }
  
//     pool.query(
//       `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
//       [username, password, email],
//       (err, result) => {
//         if (err) {
//           console.error('Error creating user:', err);
//           return res.status(500).json({ message: 'Error creating user', error: err });
//         }
//         return res.json(result.rows[0]);
//       }
//     );
//   });
  
  app.post('/users', (req, res) => {
    const { username, password, email } = req.body;
  
    // Simple validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }
  
    pool.query(
      `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
      [username, password, email],
      (err, result) => {
        if (err) {
          console.error('Detailed Error:', err);  // Log full error details
          return res.status(500).json({ message: 'Error creating user', error: err });
        }
        return res.json(result.rows[0]);
      }
    );
  });
  

// Get all boards for the authenticated user
app.get('/boards', (req, res) => {
  const { username } = req.body;
  pool.query(
    `SELECT * FROM boards WHERE creator_id = $1`,
    [username],
    (err, result) => {
      if (err) {
        console.error('Error fetching boards:', err);
        return res.status(500).json({ message: 'Error fetching boards', error: err });
      }
      return res.json(result.rows);
    }
  );
});

// Get a specific board by id
app.get('/boards/:id', (req, res) => {
  const { id } = req.params;
  pool.query(
    `SELECT * FROM boards WHERE id = $1`,
    [id],
    (err, result) => {
      if (err) {
        console.error('Error fetching board:', err);
        return res.status(500).json({ message: 'Error fetching board', error: err });
      }
      if (!result.rows.length) {
        return res.status(404).json({ message: 'Board not found' });
      }
      return res.json(result.rows[0]);
    }
  );
});

// Create a new board
app.post('/boards', (req, res) => {
  const { name, creator_id } = req.body;
  pool.query(
    `INSERT INTO boards (name, creator_id) VALUES ($1, $2) RETURNING *`,
    [name, creator_id],
    (err, result) => {
      if (err) {
        console.error('Error creating board:', err);
        return res.status(500).json({ message: 'Error creating board', error: err });
      }
      return res.json(result.rows[0]);
    }
  );
});

// Update an existing board
app.put('/boards/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool.query(
    `UPDATE boards SET name = $1 WHERE id = $2 RETURNING *`,
    [name, id],
    (err, result) => {
      if (err) {
        console.error('Error updating board:', err);
        return res.status(500).json({ message: 'Error updating board', error: err });
      }
      if (!result.rows.length) {
        return res.status(404).json({ message: 'Board not found' });
      }
      return res.json(result.rows[0]);
    }
  );
});

// Delete a board and its tasks
app.delete('/boards/:id', (req, res) => {
  const { id } = req.params;
  pool.query(`DELETE FROM boards WHERE id = $1`, [id], (err, result) => {
    if (err) {
      console.error('Error deleting board:', err);
      return res.status(500).json({ message: 'Error deleting board', error: err });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }
    return res.json({ message: 'Board deleted successfully' });
  });
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, board_id } = req.body;
  pool.query(
    `INSERT INTO tasks (title, description, board_id, status) VALUES ($1, $2, $3, 'todo') RETURNING *`,
    [title, description, board_id],
    (err, result) => {
      if (err) {
        console.error('Error creating task:', err);
        return res.status(500).json({ message: 'Error creating task', error: err });
      }
      return res.json(result.rows[0]);
    }
  );
});

// Get all tasks for a specific board
app.get('/tasks', (req, res) => {
  const { board_id } = req.body;
  pool.query(
    `SELECT * FROM tasks WHERE board_id = $1`,
    [board_id],
    (err, result) => {
      if (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).json({ message: 'Error fetching tasks', error: err });
      }
      return res.json(result.rows);
    }
  );
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  pool.query(
    `UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
    [title, description, id],
    (err, result) => {
      if (err) {
        console.error('Error updating task:', err);
        return res.status(500).json({ message: 'Error updating task', error: err });
      }
      if (!result.rows.length) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json(result.rows[0]);
    }
  );
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  pool.query(`DELETE FROM tasks WHERE id = $1`, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ message: 'Error deleting task', error: err });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json({ message: 'Task deleted successfully' });
  });
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
