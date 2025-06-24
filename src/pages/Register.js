import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link }  from 'react-router-dom';
import './Register.css'

function Register(){
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName : '',
        lastName : '',
        username :'',
        dateOfBirth : '',
        email : '',
        password : '' 
    });

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            await axios.post('http://localhost:8080/api/users/register', formData);
            localStorage.setItem('registrationSucess','true');
            navigate('/login');

        }catch (err){
            setError('Registration failed. Try again.');
        }
    };

    return (
        <div className="form-container">
            <h2 className="register-heading">Register</h2>
            {error && <p style={{color : 'red'}}>{error}</p>}
            <div className="form-card" >
            <form onSubmit={handleSubmit}>
                <input
                    type = "text"
                    placeholder="First Name"
                    required
                    value = {formData.firstName}
                    onChange={e => setFormData({...formData, firstName : e.target.value})}
                /><br/>

                <input 
                    type = "text"
                    placeholder="Last Name"
                    required
                    value = {formData.lastName}
                    onChange={e => setFormData({...formData, lastName : e.target.value})}
                /><br/>

                <input
                    type = "text"
                    placeholder="Username"
                    required
                    value = {formData.username}
                    onChange={ e => setFormData({...formData, username : e.target.value})}
                /><br/>

                <input
                    type = "date"
                    placeholder="Date of Birth"
                    required
                    value = {formData.dateOfBirth}
                    onChange={e => setFormData({...formData, dateOfBirth : e.target.value })}
                /><br/>

                <input
                    type = "email"
                    placeholder="Email"
                    required
                    value = {formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                /><br/>

                <input
                    type = "password"
                    placeholder="Password"
                    required
                    value = {formData.password}
                    onChange={e => setFormData({...formData, password : e.target.value})}
                /><br/>

                <button type = "submit">Register</button>
            </form>
            </div>
            <p className="singin-link">
                Already have an account? <Link to ="/login">Login here</Link>
            </p>
        </div>
    );
}

export default Register;

