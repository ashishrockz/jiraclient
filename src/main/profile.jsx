import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ show, handleClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (show) {
      fetchUser();
    }
  }, [show]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debugging line

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('https://server-dk5b.onrender.com/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('User Data:', response.data); // Debugging line
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Failed to fetch user: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('Failed to fetch user: No response from server. Please try again.');
      } else {
        console.error('Error message:', error.message);
        alert(`Failed to fetch user: ${error.message}`);
      }
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Profile</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {user ? (
              <div>
                <h1>{user.fullName}</h1>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                {/* Add more user details as needed */}
              </div>
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
