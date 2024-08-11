import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';

function Tasks({ boardId }) {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetch(`http://localhost:8000/tasks?board_id=${boardId}`)
      .then(response => response.json())
      .then(data => setTasks(data));
  }, [boardId]);

  const handleCreateTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}
      <TaskForm boardId={boardId} onCreate={handleCreateTask} />
    </div>
  );
}

export default Tasks;
