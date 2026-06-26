import { useState } from "react";
import API from "../services/api";

function TaskForm({ fetchTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title,
        description,
        assignedTo,
        status: "To Do",
      });

      // Clear form
      setTitle("");
      setDescription("");
      setAssignedTo("");

      // Refresh task list
      fetchTasks();

      alert("Task Added Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Add Task
      </button>

    </form>
  );
}

export default TaskForm;