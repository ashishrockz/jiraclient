import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSubTaskModal = ({ show, handleClose, parentId, projectId }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState(''); 
  const [subissueType, setSubIssueType] = useState(''); 
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://server-omega-umber.vercel.app/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login first.');
        return;
      }
  
      const response = await axios.post(
        `https://server-omega-umber.vercel.app/api/subissue/issue/${parentId}`, // Use parentId here
        { 
          title, 
          summary,
          subissueType, 
          status,
          priority,
          assignedTo,
          projectId,
          issueId: parentId // Make sure parentId is correctly used if needed
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      console.log('Subtask created:', response.data);
      handleClose();
      window.location.reload();
      alert('Subtask created successfully!');
    } catch (error) {
      console.error('Error creating subtask:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert('Failed to create subtask: ' + error.response.data.message);
      } else {
        alert('Failed to create subtask. Please try again.');
      }
    }
  };  

  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add SubTask</h5> {/* Fixed typo here */}
            <button type="button" className="close" onClick={handleClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <>
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
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-row align-items-center">
              <div className="col-4 my-1">
                  <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">Task Status</label>
                  <select 
                    className="custom-select mr-sm-2" 
                    id="inlineFormCustomSelect" 
                    name="SubtaskType" 
                    onChange={(e) => setSubIssueType(e.target.value)} 
                    defaultValue="" 
                    required
                  >
                    <option value="" disabled hidden>Choose Status</option>
                    <option value="SubTask">SubTask</option>
                    <option value="Bug">Bug</option>
                  </select>
                </div>
                <div className="col-4 my-1">
                  <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">Task Status</label>
                  <select 
                    className="custom-select mr-sm-2" 
                    id="inlineFormCustomSelect" 
                    name="status" 
                    onChange={(e) => setStatus(e.target.value)} 
                    defaultValue="" 
                    required
                  >
                    <option value="" disabled hidden>Choose Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="col-4 my-1">
                  <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">Task Priority</label>
                  <select 
                    className="custom-select mr-sm-2 " 
                    id="inlineFormCustomSelect" 
                    name="priority" 
                    onChange={(e) => setPriority(e.target.value)} 
                    defaultValue="" 
                    required
                  >
                    <option value="" disabled hidden>Choose Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Assigned to</label>
                <select 
                  className="form-control" 
                  value={assignedTo} 
                  onChange={(e) => setAssignedTo(e.target.value)} 
                  required
                >
                  <option value="" disabled hidden>Choose to Assignee</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.fullName}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={handleSubmit} className="btn btn-primary">Add Task</button>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubTaskModal;
