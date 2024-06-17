import React, { useState, useEffect, useCallback } from 'react';
import { useParams , Link } from 'react-router-dom';
import axios from 'axios';
import { FiMoreHorizontal } from "react-icons/fi";
import TaskModal from '../main/AddTask'; // Assuming you have a modal component for adding sprints
import './table.css';
import { BiFilter } from "react-icons/bi";

const Tasks = () => {
    const { sprintId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [projectId, setProjectId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);
    const [assignedToFilter, setAssignedToFilter] = useState('');
    const [users, setUsers] = useState([]);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const fetchProjectId = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found in localStorage");

            const response = await axios.get(`https://server-omega-umber.vercel.app/api/sprint/${sprintId}`, {
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

            await axios.delete(`https://server-omega-umber.vercel.app/api/issue/${taskId}`, {
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

            const response = await axios.get(`https://server-omega-umber.vercel.app/api/issue/${sprintId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                setTasks(response.data.reverse());
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

    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'status':
                setStatusFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
                break;
            case 'priority':
                setPriorityFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
                break;
            case 'type':
                setTypeFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
                break;
            case 'assignedTo':
                setAssignedToFilter(value);
                break;
            default:
                break;
        }
    };

    const filteredTasks = currentTasks.filter(task => {
        const matchesSearchTerm = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
        const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
        const matchesType = typeFilter.length === 0 || typeFilter.includes(task.issueType);
        const matchesAssignedTo = !assignedToFilter || task.assignedTo.toLowerCase().includes(assignedToFilter.toLowerCase());
        return matchesSearchTerm && matchesStatus && matchesPriority && matchesType && matchesAssignedTo;
    });

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between">
                <h6><Link to='/projects'>Projects</Link> / <Link to={`/project/${projectId}/sprint`}>Sprints</Link> / Tasks</h6>
                <button className="btn btn-primary" onClick={handleShowModal}>Create Issue</button>
            </div>
            <h4>List</h4>
            <div className="d-flex justify-content-between">
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
                <div className='d-flex'>
                    <div className="dropdown mt-3 p-2">
                        <button className="nav-link dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <BiFilter /> Filter
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <div className="dropdown-item btn btn-link">
                                    Status:
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('status', 'Open')} />
                                        Open
                                    </label>
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('status', 'Inprogress')} />
                                        Inprogress
                                    </label>
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('status', 'Closed')} />
                                        Closed
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="dropdown-item btn btn-link">Priority:
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('priority', 'High')} />
                                        High
                                    </label>
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('priority', 'Medium')} />
                                        Medium
                                    </label>
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('priority', 'Low')} />
                                        Low
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="dropdown-item btn btn-link">
                                    Type:
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('type', 'Epic')} />
                                        Epic
                                    </label>
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('type', 'Task')} />
                                        Task
                                    </label>
                                    <label className='filter p-2'>
                                        <input type='checkbox' className='thebox' onChange={() => handleFilterChange('type', 'Bug')} />
                                        Bug
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="dropdown-item btn btn-link">
                                    Assigned To:
                                    <label className='filter p-2'>
                                        <input type='text' className="form-control" onChange={(e) => handleFilterChange('assignedTo', e.target.value)} />
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
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
                                <td><Link to={`/${projectId}/sprint/${sprintId}/task/${task._id}`}>
                                    {task.title}</Link></td>
                                <td>{task.Summary}</td>
                                <td>{task.status}</td>
                                <td>{task.issueType}</td>
                                <td>{task.priority}</td>
                                <td>{task.assignedTo}</td>
                                <th>
                                    <div className="dropdown">
                                        <button className="nav-link dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <FiMoreHorizontal />
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
            </div>
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
