import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SprintModal = ({ show, handleClose, projectId }) => {
  const [sprintName, setSprintName] = useState('');
  const [sprintType, setSprintType] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login first.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/sprint',
        { 
          sprintName, 
          sprintType,
          projectId, // Ensure projectId is included in the request body
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Sprint created:', response.data);
      handleClose();
      history.push(`/projects/${projectId}`); // Adjust redirect if necessary
      alert('Sprint created successfully!');
    } catch (error) {
      console.error('Error creating sprint:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        alert('Failed to create sprint: ' + error.response.data.message);
      } else {
        alert('Failed to create sprint. Please try again.');
      }
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Sprint</h5>
            <button type="button" className="close" onClick={handleClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Sprint Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={sprintName} 
                  onChange={(e) => setSprintName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Sprint Type</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={sprintType} 
                  onChange={(e) => setSprintType(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Sprint</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintModal;
