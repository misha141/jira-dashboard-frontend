import React from 'react';
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App(){
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard"/> : <Navigate to ="/login" />}/>
        <Route path="/login" element={<Login/>}/>
        <Route path= "/register" element={<Register/>}/>
        <Route
          path = "/dashboard"
          element = {isAuthenticated ? <Dashboard /> : <Navigate to ="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;