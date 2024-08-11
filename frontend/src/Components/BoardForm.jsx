import React, { useState } from 'react';

const BoardForm = ({ onBoardCreated }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        creator_id: 'current_user_id',  // Replace with actual user ID or username
      }),
    });

    if (!response.ok) {
      console.error('Failed to create board');
      return;
    }

    const newBoard = await response.json();
    onBoardCreated(newBoard);
    setName('');  // Clear form after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Board Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Create Board</button>
    </form>
  );
};

export default BoardForm;
