import React, { useState } from 'react';
import './login_signup.css';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://server-omega-umber.vercel.app/auth/login";
      const data = { email, password };
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.token);  // Assuming res.token contains the JWT
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="container">
      {/* <div className="login_sign-page container"> */}
        <div className="text">
          <h1>Logisoft Jira</h1>
          <p>Let's sync our tasks and hearts, login to Jira,</p>
          <p>& Let's craft together.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
            required  
          />
          {error && <div className="alert alert-danger alert-dismissible">{error} <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>}
          <div className="link">
            <button type="submit" className="login">Login</button>
            <a href={() => false} className="forgot">Forgot password?</a>
          </div>
          <hr />
          <p>If you don't have an account</p>
          <div className="button">
            <a href="/signup">Register</a>
          </div>
        </form>
      {/* </div> */}
    </div>
  );
}

export default Login;
