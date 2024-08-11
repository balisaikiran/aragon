import React, { useState } from "react";
import "./BoardForm.css";

function BoardForm({ onCreate }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter a board name");
      return;
    }

    onCreate({ name: name.trim() });
    setName("");
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="board-form">
      <input
        type="text"
        placeholder="Board Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={error ? "error" : ""}
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Create Board</button>
    </form>
  );
}

export default BoardForm;