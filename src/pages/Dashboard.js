import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // 👈 import

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {user && <h2>Welcome, {user.firstName} 👋</h2>}
        <LogoutButton /> {/* 👈 use the component here */}
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Your Projects</h3>
          <Link to="/projects">View Projects</Link>
        </div>

        <div className="card">
          <h3>Your Tasks</h3>
          <Link to="/tasks">View Tasks</Link>
        </div>

        <div className="card">
          <h3>Profile</h3>
          <Link to="/profile">Go to Profile</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
