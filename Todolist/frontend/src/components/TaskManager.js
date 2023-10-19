// src/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function TaskManager() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);

  useEffect(() => {
    // Fetch tasks from the server when the component mounts
    fetchTasks('http://localhost:3001');
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/getTasks');
      setTasks(response.data.tasks);
      setIsStorageInitialized(true);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      // Send a POST request to add a task
      await axios.post('http://localhost:3001/addTask', { task });
      setTask('');
      // Updated: Fetch tasks after adding a new task
      await fetchTasks(); // Fetch updated tasks
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleClearTasks = async () => {
    try {
      await axios.post('http://localhost:3001/clearData');
    } catch (error) {
      console.error('Error clearing Node Persist data:', error);
    }
  };

  return (
    <div className='App'>
      <h1>ToDo List App</h1>
      <form onSubmit={handleAddTask} className='TodoForm' >
      <button className="todo-btn">Enter the task</button>
        <input
          type="text"
          className="todo-input"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="todo-btn">Add Task</button>
        </form>
        {isStorageInitialized ? (
          <ul>
            {tasks.map((task, index) => (
              <p key={index}>{task}</p>
            ))}
          </ul>
        ) : (
          <p>Storage is not initialized</p>
        )}
        <button className="todo-btn" onClick={handleClearTasks}>Clear Tasks</button>
      </div>
  
  );
}

export default TaskManager;
