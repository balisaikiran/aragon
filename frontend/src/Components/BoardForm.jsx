import React, { useState } from 'react';

function BoardForm({ onCreate }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:8000/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
      .then(response => response.json())
      .then(data => {
        onCreate(data);
        setName('');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New Board Name"
        required
      />
      <button type="submit">Create Board</button>
    </form>
  );
}

export default BoardForm;
