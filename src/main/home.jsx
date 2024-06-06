import React from 'react';

const Home = ({ isAuthenticated }) => {
  
  return (
    <div>
      {isAuthenticated ? (
        <div className='container-fluid justify-content-center text-center '>
          <h1>Welcome to Logisoft Jira software</h1>
        </div>
      ) : (
        <div>To see project please login </div>
      )}
    </div>
  );
};

export default Home;
