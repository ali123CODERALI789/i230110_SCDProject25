const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SCD Project 25 - NodeVault API',
    endpoints: [
      'GET /todo/:id',
      'GET /todos',
      'POST /todo',
      'PUT /todo/:id', 
      'DELETE /todo/:id',
      'GET /search?q=term',
      'GET /stats'
    ]
  });
});

// Simulate the original /todo/1 endpoint from project instructions
app.get('/todo/:id', async (req, res) => {
  try {
    const records = await db.listRecords();
    const todo = records.find(r => r.id === parseInt(req.params.id));
    
    if (todo) {
      res.json({
        userId: 1,
        id: todo.id,
        title: todo.name,
        completed: false,
        value: todo.value,
        createdAt: todo.createdAt
      });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const records = await db.listRecords();
    const todos = records.map(record => ({
      userId: 1,
      id: record.id,
      title: record.name,
      completed: false,
      value: record.value,
      createdAt: record.createdAt
    }));
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search endpoint
app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });
    
    const results = await db.searchRecords(q);
    res.json({
      searchTerm: q,
      count: results.length,
      results: results.map(r => ({
        id: r.id,
        name: r.name,
        value: r.value,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistics endpoint
app.get('/stats', async (req, res) => {
  try {
    const stats = await db.getStatistics();
    res.json(stats || { message: 'No data available' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Keep CLI functionality available via POST
app.post('/cli', async (req, res) => {
  try {
    const { action, data } = req.body;
    let result;
    
    switch (action) {
      case 'add':
        result = await db.addRecord(data);
        break;
      case 'update':
        result = await db.updateRecord(data.id, data.name, data.value);
        break;
      case 'delete':
        result = await db.deleteRecord(data.id);
        break;
      case 'export':
        result = await db.exportToFile();
        break;
      case 'sort':
        result = await db.sortRecords(data.field, data.order);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('CLI also available - run: node main.js');
});
