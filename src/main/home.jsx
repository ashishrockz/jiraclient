import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import setupAxiosInterceptors from '../utils/axiosInterceptor';

const isTokenExpired = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return true;
  return new Date() > new Date(expiry);
};

const Home = ({ isAuthenticated }) => {
  const history = useHistory();

  useEffect(() => {
    setupAxiosInterceptors(); // Setup Axios interceptors

    if (!localStorage.getItem('token') || isTokenExpired()) {
      history.push('/login');
    }
  }, [history]);

  return (
    <div>
      {isAuthenticated ? (
        <div className='container-fluid justify-content-center text-center'>
          <h1>Welcome to Logisoft Jira software</h1>
        </div>
      ) : (
        <div className='container-fluid justify-content-center text-center'>
          <h1>To see project please login</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
