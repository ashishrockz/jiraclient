import React, { useState, useEffect, useCallback } from 'react';
import { useParams , Link } from 'react-router-dom';
import axios from 'axios';
import TaskModal from '../main/AddTask'; // Assuming you have a modal component for adding sprints

 const Tasks = () => {
     const { sprintId } = useParams();
     const [showModal, setShowModal] = useState(false);
     const [tasks, setTasks] = useState([]);
     const [projectId, setProjectId] = useState(null);
     const [currentPage, setCurrentPage] = useState(1);
     const [tasksPerPage] = useState(10);
     const [searchTerm, setSearchTerm] = useState('');
     
     const handleShowModal = () => setShowModal(true);
     const handleCloseModal = () => setShowModal(false);

     const fetchProjectId = useCallback(async () => {
         try {
             const token = localStorage.getItem('token');
             if (!token) throw new Error("No token found in localStorage");

             const response = await axios.get(`http://server-dk5b.onrender.com/api/sprint/${sprintId}`, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });

             if (response.data && response.data.projectId) {
                 setProjectId(response.data.projectId);
             } else {
                 throw new Error("Unexpected response structure or missing projectId");
             }
         } catch (error) {
             console.error('Error fetching project ID:', error);
         }
     }, [sprintId]);

     const handleDelete = async (taskId) => {
         try {
             const token = localStorage.getItem('token');
             if (!token) throw new Error("No token found in localStorage");

             await axios.delete(`http://server-dk5b.onrender.com/api/issue/${taskId}`, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });

             setTasks(tasks.filter(task => task._id !== taskId));
         } catch (error) {
             console.error('Error deleting task:', error);
         }
     };

     const fetchTasks = useCallback(async () => {
         try {
             const token = localStorage.getItem('token');
             if (!token) throw new Error("No token found in localStorage");

             const response = await axios.get(`http://server-dk5b.onrender.com/api/issue/${sprintId}`, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });

             if (response.data) {
                 setTasks(response.data);
             } else {
                 throw new Error("Unexpected response structure");
             }
         } catch (error) {
             console.error('Error fetching tasks:', error);
             setTasks([]);
         } 
     }, [sprintId]);

     useEffect(() => {
         fetchProjectId();
         fetchTasks();
     }, [fetchProjectId, fetchTasks]);

     const indexOfLastTask = currentPage * tasksPerPage;
     const indexOfFirstTask = indexOfLastTask - tasksPerPage;
     const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

     const filteredTasks = currentTasks.filter(task =>
         task.title.toLowerCase().includes(searchTerm.toLowerCase())
     );

     const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between">
                 <h4><Link to='/projects'>Projects</Link> / <Link to={`/project/${projectId}/sprint`}>Sprints</Link> / Tasks</h4>
                 <button className="btn btn-primary" onClick={handleShowModal}>Create Issue</button>
             </div>
            <div className="form-inline mt-3 mb-3">
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="table table-striped ">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">customId</th>
                        <th scope="col">Title</th>
                        <th scope="col">Summary</th>
                        <th scope="col">Status</th>
                        <th scope="col">Type</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Assigned to</th>
                        <th scope="col">U/D</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task, index) => (
                        <tr key={task._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{task.customId}</td>
                            <td><Link to={`/${sprintId}/task/${task._id}`}>{task.title}</Link></td>
                            <td>{task.Summary}</td>
                            <td>{task.status}</td>
                            <td>{task.issueType}</td>
                            <td>{task.priority}</td>
                            <td>{task.assignedTo}</td>
                            <th>
                                <div className="dropdown">
                                    <button className="nav-link dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bi bi-three-dots"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item btn btn-link">Update</Link></li>
                                        
                                        <li><button className="dropdown-item btn btn-link" onClick={() => handleDelete(task._id)} type="button">Delete</button></li>
                                    </ul>
                                </div>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === Math.ceil(tasks.length / tasksPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
            {projectId && (
                <TaskModal show={showModal} handleClose={handleCloseModal} sprintId={sprintId} projectId={projectId} />
            )}
        </div>
    );
};

export default Tasks;