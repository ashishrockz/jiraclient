import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useHistory } from 'react-router-dom';
import EditTaskModal from '../main/update_task';
import { formatDate } from '../utils/formatDate.js'; // Import the formatDate function
const IndividualTask = () => {
  const { id, projectId, sprintId } = useParams(); // Extract task ID from URL parameters
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const response = await axios.get(`https://server-omega-umber.vercel.app/api/issue/sprintId/task/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API Response:', response.data); // Log API response

        if (response.data) {
          setTask(response.data);
        } else {
          throw new Error("Task not found");
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found in localStorage");
      }
      await axios.delete(`https://server-omega-umber.vercel.app/api/issue/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      history.push(`/${projectId}/sprint/${sprintId}/tasks`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  console.log('Task:', task); // Log task data

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between">
        <h6>
          <Link to='/projects'>Projects</Link> /
          <Link to={`/project/${projectId}/sprint`}>Sprints</Link>/
          <Link to={`/${projectId}/sprint/${sprintId}/tasks`}>Tasks</Link>
        </h6>
      </div>

      <h5>Task Details</h5>
      {task && (
        <div>
          <p><strong>Custom ID:</strong> {task.customId}</p>
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Summary:</strong> {task.Summary}</p> {/* Check for correct property name */}
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Type:</strong> {task.issueType}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Assigned to:</strong> {task.assignedTo}</p>
          <p><strong>Created Date:</strong>{formatDate(task.createdDate)}</p>
          <p><strong>Updated Date:</strong>{formatDate(task.updatedDate)}</p>
          <div className='row'>
            <div className='col'>
              <button className="btn btn-primary" onClick={handleShowModal}>update</button>
            </div>
            <div className='col-8'>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <EditTaskModal show={showModal} handleClose={handleCloseModal}/>
    </div>
  );
};

export default IndividualTask;
