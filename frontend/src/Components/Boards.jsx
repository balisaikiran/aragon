import React from 'react';
import Tasks from './Tasks';

function Boards({ boards }) {
  return (
    <div>
      {boards.map(board => (
        <div key={board.id}>
          <h2>{board.name}</h2>
          <Tasks boardId={board.id} />
        </div>
      ))}
    </div>
  );
}

export default Boards;
