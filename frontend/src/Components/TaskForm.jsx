import React, { useState } from 'react';

const TaskForm = ({ boardId, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        board_id: boardId,
      }),
    });

    if (!response.ok) {
      console.error('Failed to create task');
      return;
    }

    const newTask = await response.json();
    onTaskCreated(newTask);
    setTitle('');  // Clear form after submission
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
