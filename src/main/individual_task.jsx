import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useHistory } from 'react-router-dom';
import EditTaskModal from '../main/update_task';
import AddSubTaskModal from '../main/AddSubTask.jsx';
import { formatDate } from '../utils/formatDate.js';
import { FiMoreHorizontal } from "react-icons/fi";
import './table.css';

const IndividualTask = () => {
  const { id, projectId, sprintId } = useParams();
  const [task, setTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);
  const [subTasks, setSubTasks] = useState([]);
  const history = useHistory();

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowSubTaskModal = () => setShowSubTaskModal(true);
  const handleCloseSubTaskModal = () => setShowSubTaskModal(false);

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

        console.log('API Response:', response.data);

        if (response.data) {
          setTask(response.data);
          // If the task is a Task, fetch its subtasks
          if (response.data.issueType === 'Task') {
            // Define fetchSubTasks here
            const fetchSubTasks = async () => {
              try {
                const response = await axios.get(`https://server-omega-umber.vercel.app/api/subissue/issue/${id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

                console.log('Subtasks Response:', response.data);

                if (response.data) {
                  setSubTasks(response.data);
                } else {
                  throw new Error("Subtasks not found");
                }
              } catch (error) {
                console.error('Error fetching subtasks:', error);
              }
            };

            await fetchSubTasks(); // Call fetchSubTasks
          }
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

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found in localStorage");
      }
      await axios.delete(`https://server-omega-umber.vercel.app/api/issue/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Redirect to tasks list after deletion
      history.push(`/${projectId}/sprint/${sprintId}/tasks`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  console.log('Task:', task);
  console.log('Subtasks:', subTasks);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between">
        <h6>
          <Link to='/projects'>Projects</Link> /
          <Link to={`/project/${projectId}/sprint`}>Sprints</Link> /
          <Link to={`/${projectId}/sprint/${sprintId}/tasks`}>Tasks</Link>
        </h6>
        {task && task.issueType === 'Task' && (
          <button className="btn btn-primary" onClick={handleShowSubTaskModal}>Create SubIssue</button>
        )}
      </div>

      <h5>Task Details</h5>
      {task && (
        <div>
          <p><strong>Custom ID:</strong> {task.customId}</p>
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Summary:</strong> {task.Summary}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Type:</strong> {task.issueType}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Assigned to:</strong> {task.assignedTo}</p>
          <p><strong>Created Date:</strong> {formatDate(task.createdDate)}</p>
          <p><strong>Updated Date:</strong> {formatDate(task.updatedDate)}</p>
          <div className='row'>
            <div className='col'>
              <button className="btn btn-primary" onClick={handleShowEditModal}>Update</button>
            </div>
            <div className='col-8'>
              <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Render Subtasks if the task is a Task */}
      {task && task.issueType === 'Task' && (
        <div className='mt-3'>
          <h5>Subtasks</h5>
          {subTasks.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Custom ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Summary</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Assigned to</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subTasks.map((subtask, index) => (
                    <tr key={subtask._id}>
                      <td>{index + 1}</td>
                      <td>{subtask.customId}</td>
                      <td><Link to={`/${projectId}/sprint/${sprintId}/task/${subtask._id}`}>{subtask.title}</Link></td>
                      <td>{subtask.summary.split(" ").slice(0, 15).join(" ")}{subtask.summary.split(" ").length > 15 ? "..." : "" }</td>
                      <td>{subtask.subissueType}</td>
                      <td>{subtask.status}</td>
                      <td>{subtask.priority}</td>
                      <td>{subtask.assignedTo}</td>
                      <td>
                        <div className="dropdown">
                          <button className="nav-link dropdown" type="button" id={`dropdownMenuButton${index}`} data-bs-toggle="dropdown" aria-expanded="false">
                            <FiMoreHorizontal />
                          </button>
                          <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${index}`}>
                            <li><button className="dropdown-item" onClick={() => handleDelete(subtask._id)}>Delete</button></li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>There no subtasks created</p>
          )}
        </div>
      )}

      <EditTaskModal show={showEditModal} handleClose={handleCloseEditModal}/>
      <AddSubTaskModal show={showSubTaskModal} handleClose={handleCloseSubTaskModal} parentId={id} projectId={projectId} />
    </div>
  );
};

export default IndividualTask;
