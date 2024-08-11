import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState(null);
  const [editedBoardName, setEditedBoardName] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const response = await fetch('http://localhost:8000/boards');
    const data = await response.json();
    setBoards(data);
  };

  const createBoard = async () => {
    if (!newBoardName) return;

    const response = await fetch('http://localhost:8000/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newBoardName, creator_id: 'User1' }),
    });

    if (response.ok) {
      fetchBoards();
      setNewBoardName('');
    }
  };

  const updateBoard = async (id) => {
    if (!editedBoardName) return;

    const response = await fetch(`http://localhost:8000/boards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editedBoardName }),
    });

    if (response.ok) {
      fetchBoards();
      setEditingBoard(null);
    }
  };

  const deleteBoard = async (id) => {
    const response = await fetch(`http://localhost:8000/boards/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchBoards();
    }
  };

  return (
    <div>
      <h1>Boards</h1>
      <input
        type="text"
        value={newBoardName}
        onChange={(e) => setNewBoardName(e.target.value)}
        placeholder="New board name"
      />
      <button onClick={createBoard}>Create Board</button>

      {boards.map((board) => (
        <div key={board.id}>
          {editingBoard === board.id ? (
            <div>
              <input
                type="text"
                value={editedBoardName}
                onChange={(e) => setEditedBoardName(e.target.value)}
                placeholder="Edit board name"
              />
              <button onClick={() => updateBoard(board.id)}>Update</button>
              <button onClick={() => setEditingBoard(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <span>{board.name}</span>
              <button onClick={() => setEditingBoard(board.id)}>Edit</button>
              <button onClick={() => deleteBoard(board.id)}>Delete</button>
              <Link to={`/boards/${board.id}/tasks`}>
                <button>View Tasks</button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BoardList;
