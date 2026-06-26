import { useState } from "react";
import API from "../services/api";

function EditTask({ task, fetchTasks }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo);

  const handleUpdate = async () => {
    try {
      await API.put(`/${task._id}`, {
        title,
        description,
        assignedTo,
        status: task.status,
      });

      fetchTasks();
      alert("Task updated successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card p-3 mt-3">
      <input
        className="form-control mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="form-control mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="form-control mb-2"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      />

      <button
        className="btn btn-success"
        onClick={handleUpdate}
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditTask;