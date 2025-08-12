const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a task
router.post('/', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.json(result.rows[0]);
});

// Update task completion
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const result = await pool.query(
    'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
    [completed, id]
  );
  res.json(result.rows[0]);
});

// Delete task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
