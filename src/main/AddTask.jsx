import React, { useState } from 'react';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const AddTaskModal = ({ show, handleClose, sprintId, projectId }) => {
  const [title, setTitle] = useState('');
  const [Summary, setSummary] = useState('');
  const [status, setStatus] = useState('');
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('');
  // const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login first.');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/issue/${sprintId}`,
        { 
          title, 
          Summary,
          status,
          issueType,
          priority,
          projectId, // Include projectId in the request body
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Task created:', response.data);
      handleClose();
      // history.push(`/tasks/${sprintId}`); // Navigate to the task page
      window.location.reload(); // Reload the page to reflect the new task
      alert('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        alert('Failed to create task: ' + error.response.data.message);
      } else {
        alert('Failed to create task. Please try again.');
      }
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Task</h5>
            <button type="button" className="close" onClick={handleClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <textarea 
                  className="form-control" 
                  value={Summary} 
                  onChange={(e) => setSummary(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={issueType} 
                  onChange={(e) => setIssueType(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Task</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
