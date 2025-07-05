import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null); // null initially
  const [error, setError] = useState('');

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token being used:", token);

      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User data received:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError('Failed to load user data');
    }
  };

  fetchUser();
}, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>; // shows while data is loading

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
    </div>
  );
}

export default Profile;
