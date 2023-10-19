const express = require('express');
const app = express();
const storage = require('node-persist');
const cors = require('cors');

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Flag to check if storage is initialized
let isStorageInitialized = false;

// Initialize node-persist storage
(async () => {
  try {
    await storage.init();
    isStorageInitialized = true;
    console.log('Storage initialized successfully');

    // Start the server only after storage is initialized
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
})();

// Define a route to handle task creation
app.post('/addTask', async (req, res) => {
  const { task } = req.body;
  

  try {
    // Check if storage is initialized
    if (!isStorageInitialized) {
      console.error('Storage is not initialized');
      res.status(500).json({ error: 'Storage is not initialized' });
      return;
    }

    // Get existing tasks from storage
    let tasks = await storage.getItem('tasks');

    // If tasks is null or undefined, initialize it as an empty array
    if (!tasks) {
      tasks = [];
    }

    // Add the new task
    tasks.push(task);

    // Update tasks in storage
    await storage.setItem('tasks', tasks);

    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Define a route to get all tasks
app.get('/getTasks', async (req, res) => {
  try {
    // Check if storage is initialized
    if (!isStorageInitialized) {
      console.error('Storage is not initialized');
      res.status(500).json({ error: 'Storage is not initialized' });
      return;
    }

    // Get tasks from storage
    const tasks = await storage.getItem('tasks') || [];

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/clearData', async (req, res) => {
  try {
    // Clear tasks from storage
    await storage.clear();
    res.status(200).json({ message: 'Node Persist data cleared successfully' });
  } catch (error) {
    console.error('Error clearing Node Persist data:', error);
    res.status(500).json({ error: 'Failed to clear Node Persist data' });
  }
});
