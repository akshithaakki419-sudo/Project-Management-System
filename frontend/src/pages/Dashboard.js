import { useEffect, useState } from "react";
import API from "../services/api";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Statistics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(
    (task) => task.status === "To Do"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const testingTasks = tasks.filter(
    (task) => task.status === "Testing"
  ).length;
  const doneTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Project Management Dashboard
      </h1>

      <TaskForm fetchTasks={fetchTasks} />

      <hr />

      {/* Statistics */}
      <div className="row text-center mb-4">
        <div className="col">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Total</h5>
              <h3>{totalTasks}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card bg-warning">
            <div className="card-body">
              <h5>To Do</h5>
              <h3>{todoTasks}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>In Progress</h5>
              <h3>{inProgressTasks}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <h5>Testing</h5>
              <h3>{testingTasks}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Done</h5>
              <h3>{doneTasks}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Task Title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter */}
      <div className="mb-3">
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Testing</option>
          <option>Done</option>
        </select>
      </div>

      <h2 className="mb-3">Tasks</h2>

      {tasks
        .filter((task) =>
          task.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((task) =>
          statusFilter === "All"
            ? true
            : task.status === statusFilter
        )
        .map((task) => (
          <div key={task._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h4>{task.title}</h4>

              <p>{task.description}</p>

              <p>
                <strong>Assigned To:</strong> {task.assignedTo}
              </p>

              <div className="mb-3">
                <strong>Status</strong>

                <select
                  className="form-select mt-2"
                  value={task.status}
                  onChange={async (e) => {
                    try {
                      await API.put(`/tasks/${task._id}`, {
                        status: e.target.value,
                      });
                      fetchTasks();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Testing</option>
                  <option>Done</option>
                </select>
              </div>

              <button
                className="btn btn-danger"
                onClick={async () => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this task?"
                  );

                  if (!confirmDelete) return;

                  try {
                    await API.delete(`/tasks/${task._id}`);
                    fetchTasks();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Delete Task
              </button>
            </div>
          </div>
        ))}

      {tasks.length === 0 && (
        <p className="text-center mt-3">
          No tasks found.
        </p>
      )}

      {/* Logout Button at Bottom */}
      <div className="text-center mt-5 mb-4">
        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;