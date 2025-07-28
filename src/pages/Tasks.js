import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tasks.css';

// Remove projectId from props if Tasks component is now responsible for selection
function Tasks() { // projectId prop is removed
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]); // New state for projects
  const [selectedProjectId, setSelectedProjectId] = useState(''); // New state for selected project
  const [modalOpen, setModalOpen] = useState(false);
  const [formTask, setFormTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    projectId: '', // Initially empty, will be set by selectedProjectId
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const token = localStorage.getItem('token');

  // --- New useEffect to fetch all projects on component mount ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/projects', { // Assuming this endpoint exists
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
        // Automatically select the first project if available
        if (res.data.length > 0) {
          setSelectedProjectId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, [token]); // Run once on mount

  // --- Modified useEffect to fetch tasks whenever selectedProjectId changes ---
  useEffect(() => {
    if (selectedProjectId) { // Only fetch tasks if a project is selected
      fetchTasks(selectedProjectId);
    } else {
      setTasks([]); // Clear tasks if no project is selected
    }
  }, [selectedProjectId, token]); // Re-fetch when selectedProjectId or token changes

  // --- Modified fetchTasks to accept projectId as argument ---
  const fetchTasks = async (projectIdToFetch) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/tasks/project/${projectIdToFetch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(`Error fetching tasks for project ${projectIdToFetch}:`, err);
      // Handle cases where project might not exist or no tasks
      setTasks([]); // Clear tasks if there's an error
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setFormTask({
        title: task.title,
        description: task.description,
        status: task.status,
        projectId: task.projectId, // Use existing task's projectId for editing
      });
      setEditingTaskId(task.id);
    } else {
      // For new task, use the currently selected projectId
      setFormTask({
        title: '',
        description: '',
        status: 'To Do',
        projectId: selectedProjectId, // Use the currently selected project ID
      });
      setEditingTaskId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormTask({
      title: '',
      description: '',
      status: 'To Do',
      projectId: selectedProjectId, // Reset with current selectedProjectId
    });
    setEditingTaskId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formTask.projectId) {
        alert('Project ID is missing. Please select a project or ensure one is pre-selected.');
        return;
      }

      if (editingTaskId) {
        // Edit mode
        await axios.put(`http://localhost:8080/api/tasks/${editingTaskId}`, formTask, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add mode
        await axios.post('http://localhost:8080/api/tasks', formTask, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      closeModal();
      // Re-fetch tasks for the *currently selected* project
      fetchTasks(selectedProjectId);
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Error saving task. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(selectedProjectId); // Re-fetch for the current project
    } catch (err) {
      console.error('Error deleting task:', err);
      alert("Error deleting task. Check console for details.");
    }
  };

  const groupedTasks = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done'),
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <div className="project-selection-and-add">
          <label htmlFor="project-select">Select Project:</label>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="project-select-dropdown" // Add a class for styling
          >
            <option value="">-- Select a Project --</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} {/* Assuming project object has an 'id' and 'name' */}
              </option>
            ))}
          </select>
          <button
            className="add-task-button"
            onClick={() => openModal()}
            disabled={!selectedProjectId} // Disable if no project is selected
          >
            Add New Task
          </button>
          <button className="refresh-button" onClick={() => fetchTasks(selectedProjectId)}>
            Refresh
          </button>
        </div>
      </div>

      {selectedProjectId ? (
        <div className="task-columns">
          {['To Do', 'In Progress', 'Done'].map(status => (
            <div key={status} className="task-column">
              <h3>{status}</h3>
              {groupedTasks[status].length === 0 ? (
                <p className="no-tasks-message">No tasks in this category.</p>
              ) : (
                groupedTasks[status].map(task => (
                  <div key={task.id} className="task-card">
                    <h4>Task #{task.taskId}: {task.title}</h4>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-actions">
                      <button onClick={() => openModal(task)}>Edit</button>
                      <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="select-project-prompt">Please select a project to view its tasks.</p>
      )}


      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingTaskId ? 'Edit Task' : 'New Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="project-id-display">
                <label>Project:</label>
                {/* Display selected project name instead of just ID */}
                <input
                  type="text"
                  value={projects.find(p => p.id === formTask.projectId)?.name || 'Loading...'}
                  disabled
                />
              </div>

              <input
                type="text"
                placeholder="Title"
                value={formTask.title}
                onChange={e => setFormTask({ ...formTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formTask.description}
                onChange={e => setFormTask({ ...formTask, description: e.target.value })}
                required
              ></textarea>
              <select
                value={formTask.status}
                onChange={e => setFormTask({ ...formTask, status: e.target.value })}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;