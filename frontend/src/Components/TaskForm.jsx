import React, { useState } from 'react';

function TaskForm({ boardId, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:8000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, board_id: boardId }),
    })
      .then(response => response.json())
      .then(data => {
        onCreate(data);
        setTitle('');
        setDescription('');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        required
      />
      <button type="submit">Create Task</button>
    </form>
  );
}

export default TaskForm;
