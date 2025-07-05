import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject ] = useState({name: '', description: ''});
  const [editProject, setEditProject] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError('Failed to load Projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleCreate = async (e) => {
    e.preventDefault();
    try{
      await axios.post(`http://localhost:8080/api/projects`, newProject,{
        headers: {Authorization: `Bearer ${token}`}
      });
      setNewProject({new : '', description: ''});
      fetchProjects();
    }catch(err){
      console.error('Error creating project', err );
    }
  };

  const handleDelete = async(id) =>{
    if(!window.confirm('Are you sure you want to delete this project?')) return;

    try{
      await axios.delete(`http://localhost:8080/api/projects/${id}`,{
        headers :{Authorization: `Bearer ${token}`}
      });
      fetchProjects();
    } catch (err){
      console.error('Error deleting project', err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/projects/${editProject.id}`, editProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  return (
    <div className="projects-container">
      <h2> Projects</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleCreate} className="project-form">
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={e => setNewProject({ ...newProject, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          required
        />
        <button type="submit">Add Project</button>
      </form>

      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            {editProject && editProject.id == project.id?(
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={editProject.name}
                  onChange={(e) => setEditProject({...editProject, name: e.target.value})}
                />
                <input
                  type="text"
                  value={editProject.description}
                  onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                />
                <button type="Submit" >Save</button>
                <button onClick={() => setEditProject(null)} >Cancel</button>

              </form>
            ):(
              <>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-actions">
                <button onClick={() => setEditProject(project)}>Edit</button>
                <button onClick={() => handleDelete(project.id)}>Delete</button>

              </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
