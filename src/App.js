import React from 'react';
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';

function App(){
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
       <Route path ="/" element = {<Navigate to ={isAuthenticated ? "/dashboard" : "/login"}/>}/>
       <Route path = "/login" element = {<Login/>}/>
       <Route path = "/register" element = {<Register/>}/>
       <Route path="/profile" 
        element={<PrivateRoute><Profile/></PrivateRoute>} />

       <Route
          path = "/dashboard"
          element={<PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;