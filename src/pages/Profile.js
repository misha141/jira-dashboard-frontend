import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError('Failed to load user data');
      }
    };

    fetchUser();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-heading">User Profile</h2>

        <div className="profile-detail">
          <span>First Name:</span> {user.firstName}
        </div>
        <div className="profile-detail">
          <span>Last Name:</span> {user.lastName}
        </div>
        <div className="profile-detail">
          <span>Username:</span> {user.username}
        </div>
        <div className="profile-detail">
          <span>Email:</span> {user.email}
        </div>
        <div className="profile-detail">
          <span>Date of Birth:</span> {user.dateOfBirth}
        </div>
      </div>
    </div>
  );
}

export default Profile;
