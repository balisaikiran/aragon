import { createContext, useState } from 'react';

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState({});

  const createBoard = (board) => {
    setBoards((prevBoards) => [...prevBoards, board]);
  };

  const createTask = (task) => {
    setTasks((prevTasks) => ({ ...prevTasks, [task.board_id]: [...(prevTasks[task.board_id] || []), task] }));
  };

  return (
    <StoreContext.Provider value={{ boards, tasks, createBoard, createTask }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreProvider, StoreContext };