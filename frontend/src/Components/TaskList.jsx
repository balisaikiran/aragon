import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TaskList = () => {
  const { boardId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  const fetchTasks = async () => {
    const response = await fetch(`http://localhost:8000/tasks?board_id=${boardId}`);
    const data = await response.json();
    setTasks(data);
  };

  const createTask = async () => {
    if (!newTaskTitle || !newTaskDescription) return;

    const response = await fetch('http://localhost:8000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTaskTitle,
        description: newTaskDescription,
        board_id: boardId,
      }),
    });

    if (response.ok) {
      fetchTasks();
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const updateTask = async (id) => {
    if (!editedTaskTitle || !editedTaskDescription) return;

    const response = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editedTaskTitle,
        description: editedTaskDescription,
      }),
    });

    if (response.ok) {
      fetchTasks();
      setEditingTask(null);
    }
  };

  const deleteTask = async (id) => {
    const response = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchTasks();
    }
  };

  return (
    <div>
      <h1>Tasks</h1>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="New task title"
      />
      <input
        type="text"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        placeholder="New task description"
      />
      <button onClick={createTask}>Create Task</button>

      {tasks.map((task) => (
        <div key={task.id}>
          {editingTask === task.id ? (
            <div>
              <input
                type="text"
                value={editedTaskTitle}
                onChange={(e) => setEditedTaskTitle(e.target.value)}
                placeholder="Edit task title"
              />
              <input
                type="text"
                value={editedTaskDescription}
                onChange={(e) => setEditedTaskDescription(e.target.value)}
                placeholder="Edit task description"
              />
              <button onClick={() => updateTask(task.id)}>Update</button>
              <button onClick={() => setEditingTask(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <span>{task.title}</span>
              <button onClick={() => setEditingTask(task.id)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
