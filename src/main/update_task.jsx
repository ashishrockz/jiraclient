import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditTaskModal = ({ show, handleClose }) => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [Summary, setSummary] = useState('');
  const [status, setStatus] = useState('');
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`https://server-omega-umber.vercel.app/api/issue/sprintId/task/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const taskData = response.data;
        setTitle(taskData.title);
        setSummary(taskData.Summary);
        setStatus(taskData.status);
        setIssueType(taskData.issueType);
        setPriority(taskData.priority);
        setAssignedTo(taskData.assignedTo);
      } catch (error) {
        console.error('Error fetching task:', error);
        alert('Failed to fetch task. Please try again.');
      }
    };

    if (show) {
      fetchTask();
      fetchUsers();
    }
  }, [show, id]); // Added id to the dependency array

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

      const response = await axios.put(
        `https://server-omega-umber.vercel.app/api/issue/${id}`,
        { 
          title, 
          Summary,
          status,
          issueType,
          priority,
          assignedTo,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Task updated:', response.data);
      handleClose();
      window.location.reload();
      alert('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        alert('Failed to update task: ' + error.response.data.message);
      } else {
        alert('Failed to update task. Please try again.');
      }
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
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
                  value={Summary} 
                  onChange={(e) => setSummary(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-row align-items-center">
                <div className="col-4 my-1">
                  <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">Task Type</label>
                  <select 
                    className="custom-select mr-sm-2" 
                    id="inlineFormCustomSelect" 
                    name="issueType" 
                    onChange={(e) => setIssueType(e.target.value)} 
                    value={issueType}
                    required
                  >
                    <option value="" disabled hidden>Choose Type</option>
                    <option value="Epic">Epic</option>
                    <option value="Task">Task</option>
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
                    value={status}
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
                    value={priority}
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
              <button type="button" onClick={handleSubmit} className="btn btn-primary">Update Task</button>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
