import React, { useState } from "react";
import "./TaskForm.css";

function TaskForm({ boardId, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please enter a task title and description");
      return;
    }

    onCreate({ title: title.trim(), description: description.trim(), board_id: boardId });
    setTitle("");
    setDescription("");
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={error && !title.trim() ? "error" : ""}
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={error && !description.trim() ? "error" : ""}
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Create Task</button>
    </form>
  );
}

export default TaskForm;