import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterProject, setFilterProject] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    status: 'To Do',
    projectId: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:8080/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(res.data);
  };

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:8080/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProjects(res.data);
  };

  const handleFilterChange = (e) => setFilterProject(e.target.value);

  const filteredTasks = tasks.filter(task =>
    !filterProject || task.projectId === filterProject
  );

  const groupByStatus = (status) => filteredTasks.filter(task => task.status === status);

  const openModal = (task = null) => {
    if (task) {
        setFormData(task); // Edit mode: keep ID
    } else {
        setFormData({
        id: '', // Ensure id is empty
        title: '',
        description: '',
        status: 'To Do',
        projectId: ''
        });
    }
    setModalOpen(true);
    };


  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      id: '',
      title: '',
      description: '',
      status: 'To Do',
      projectId: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://localhost:8080/api/tasks/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8080/api/tasks', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTasks();
      closeModal();
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="tasks-page">
      <div className="header-bar">
        <h2>Tasks</h2>
        <button className="add-task-btn" onClick={() => openModal()}>+ Add New Task</button>
      </div>

      <div className="filter-bar">
        <select value={filterProject} onChange={handleFilterChange}>
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="kanban-board">
        {['To Do', 'In Progress', 'Done'].map(status => (
          <div className="kanban-column" key={status}>
            <h3>{status}</h3>
            {groupByStatus(status).map(task => (
              <div className="task-card" key={task.id}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p className="project-name">
                  {projects.find(p => p.id === task.projectId)?.name || 'No Project'}
                </p>
                <div className="task-actions">
                  <button onClick={() => openModal(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{formData.id ? "Edit Task" : "Add Task"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task Title"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task Description"
              />
              <select name="status" value={formData.status} onChange={handleChange}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <select name="projectId" value={formData.projectId} onChange={handleChange} required>
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button type="submit">Save</button>
              <button type="button" onClick={closeModal} style={{ background: '#ccc', marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
