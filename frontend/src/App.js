// import React, { useState, useEffect } from 'react';
// import BoardForm from './Components/BoardForm';
// import Boards from './Components/Boards';
// function App() {
//   const [boards, setBoards] = useState([]);
  
//   useEffect(() => {
//     // Fetch boards from the backend
//     fetch('/boards')
//       .then(response => response.json())
//       .then(data => setBoards(data));
//   }, []);
  
//   const handleCreateBoard = (board) => {
//     setBoards([...boards, board]);
//   };

//   return (
//     <div className="App">
//       <h1>Kanban Board</h1>
//       <BoardForm onCreate={handleCreateBoard} />
//       <Boards boards={boards} />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BoardList from './BoardList';
import TaskList from './TaskList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="/boards/:boardId/tasks" element={<TaskList />} />
      </Routes>
    </Router>
  );
}

export default App;
