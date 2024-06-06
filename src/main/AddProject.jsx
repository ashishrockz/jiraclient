import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ProjectModal = ({ show, handleClose }) => {
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [projectType, setProjectType] = useState('');

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login first.');
        return;
      }

      console.log('Token:', token); // Debug: Verify token is retrieved correctly

      const response = await axios.post(
        'http://server-dk5b.onrender.com/api/project/',
        { 
          name: projectName, 
          key: projectKey,
          type:projectType,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Project created:', response.data);
      handleClose();
      history.push('/projects');
      alert('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response) {
        console.error('Error response:', error.response); // Debug: Detailed error response
        alert('Failed to create project: ' + error.response.data.message);
      } else {
        alert('Failed to create project. Please try again.');
      }
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Project</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="projectName" className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="projectName" 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="projectKey" className="form-label">Project Key</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="projectKey" 
                  value={projectKey} 
                  onChange={(e) => setProjectKey(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="projectKey" className="form-label">Project Type</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="projectType" 
                  value={projectType} 
                  onChange={(e) => setProjectType(e.target.value)} 
                  required 
                />
              </div>
            
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
