import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Login from './login';
import BoardForm from './Components/BoardForm';
import Board from './Components/Board';
import TaskForm from './Components/TaskForm';
import Task from './Components/Task';
import { fetchBoards, fetchTasks, createBoard, createTask, updateTask, deleteTask } from './Services/api.js'; // Make sure this path is correct

import './App.css';

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBoards().then(setBoards).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (selectedBoard) {
      fetchTasks(selectedBoard.id).then(setTasks).catch(console.error);
    }
  }, [selectedBoard]);

  const handleCreateBoard = async (newBoard) => {
    try {
      const createdBoard = await createBoard(newBoard);
      setBoards(prevBoards => [...prevBoards, createdBoard]);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks(prevTasks => [...prevTasks, createdTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const updated = await updateTask(updatedTask);
      setTasks(prevTasks => prevTasks.map(task => task.id === updated.id ? updated : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <header>
        <h1>Task Management App</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <main>
        <section className="boards">
          <h2>Boards</h2>
          <BoardForm onCreate={handleCreateBoard} />
          {boards.map(board => (
            <Board key={board.id} board={board} onSelect={setSelectedBoard} />
          ))}
        </section>
        {selectedBoard && (
          <section className="tasks">
            <h2>{selectedBoard.name} Tasks</h2>
            <TaskForm boardId={selectedBoard.id} onCreate={handleCreateTask} />
            {tasks.map(task => (
              <Task key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;