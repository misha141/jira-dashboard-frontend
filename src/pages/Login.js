import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/api/users/login', {email, password});
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
            } catch (err){
                setError('Invalid email or password');
            }
    };

    return (
        <div>
            <h2> Login </h2>
            {error && <p style = {{color : 'red'}}>{error}</p>}
            <form onSubmit = {handleSubmit}>
                <input
                 type = "email" placeholder="Email" required
                 value = {email}  onChange={e => setEmail(e.target.value)}
                 /><br/>
                 <input 
                 type = "password" placeholder="Password" required
                 value = {password} onChange={e => setPassword(e.target.value)}
                 /><br/>
                 <button type = "submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to = "/register">Register Here</Link>
            </p>

        </div>
    );
    
}

export default Login;
