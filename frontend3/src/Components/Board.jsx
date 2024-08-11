import React from "react";
import "./Board.css";

function Board({ board, onSelect }) {
  return (
    <div className="board" onClick={() => onSelect(board)}>
      <h3>{board.name}</h3>
      <p>Created at: {new Date(board.created_at).toLocaleDateString()}</p>
    </div>
  );
}

export default Board;