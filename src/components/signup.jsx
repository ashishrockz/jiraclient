import React, { useState } from 'react';
import './login_signup.css';
import axios from 'axios';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://server-dk5b.onrender.com/auth/signup", { fullName, email, role, password });
      window.location.href = "/login";
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="container flex">
        <div className="text">
          <h1>Logisoft Jira</h1>
          <p>Let's start our journey on Jira, together!</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            name="fullName" 
            onChange={(e) => setFullName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            name="email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <select 
            name="role" 
            onChange={(e) => setRole(e.target.value)} 
            defaultValue="" 
            required
          >
            <option value="" disabled hidden>Choose your role</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
            <option value="bd">BD</option>
          </select>
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <div className="link">
            <button type="submit" className="login">Register</button>
          </div>
          <hr />
          <a>If you have an account</a>
          <div className="button">
            <a href="/login">Login</a>
          </div>
        </form>
    </div>
  );
}

export default Signup;
