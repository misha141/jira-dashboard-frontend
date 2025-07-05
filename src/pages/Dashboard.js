import React from 'react';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';



function Dashboard(){

    return(
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your Jira Dashboard!</p>
            <LogoutButton/>
            <Link to="/Profile">Go to Profile</Link>
        </div>
    );
}

export default Dashboard;
