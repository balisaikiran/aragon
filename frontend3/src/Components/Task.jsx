import React, { useState } from "react";
import "./Task.css";

function Task({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleSave = () => {
    if (!editedTask.title.trim() || !editedTask.description.trim()) {
      alert("Title and description are required");
      return;
    }
    onUpdate(editedTask);
    setIsEditing(false);
  };

  return (
    <div className="task">
      {isEditing ? (
        <div className="edit-task">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          />
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
          <div className="button-group">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <div className="button-group">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Task;