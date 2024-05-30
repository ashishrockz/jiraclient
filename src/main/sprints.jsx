import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import './style.css';
import SprintModal from '../main/AddSprint'; // Assuming you have a modal component for adding sprints
import axios from 'axios';
import { formatDate } from '../utils/formatDate.js'; // Import the formatDate function

const Sprints = () => {
    const { projectId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [sprints, setSprints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sprintsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const fetchSprints = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage");
            }

            console.log('Fetching sprints with token:', token);

            const response = await axios.get(`http://localhost:8080/api/sprint/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('API response:', response);

            if (response.data) {
                setSprints(response.data);
            } else {
                throw new Error("Unexpected response structure");
            }
        } catch (error) {
            console.error('Error fetching sprints:', error);
            setSprints([]);
        }
    }, [projectId]);

    useEffect(() => {
        fetchSprints();
    }, [fetchSprints]);

    // Logic for pagination
    const indexOfLastSprint = currentPage * sprintsPerPage;
    const indexOfFirstSprint = indexOfLastSprint - sprintsPerPage;
    const currentSprints = (sprints || []).slice(indexOfFirstSprint, indexOfLastSprint);

    // Filter sprints based on the search term
    const filteredSprints = currentSprints.filter(sprint =>
        sprint.sprintName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between">
                <h4>Sprints</h4>
                <button className="btn btn-primary" onClick={handleShowModal}>Create Sprint</button>
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
            <table className="table table-striped text-center">
                <thead >
                    <tr>
                        <th scope="col ">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSprints.map((sprint, index) => (
                        <tr key={sprint._id}>
                            <th scope="row">{indexOfFirstSprint + index + 1}</th>
                            <td>
                                <Link to={{ pathname: `/${projectId}/sprint/${sprint._id}/tasks` }}>
                                    {sprint.sprintName}
                                </Link>
                            </td>
                            <td>{sprint.sprintType}</td>
                            <td>{formatDate(sprint.createdDate)}</td> {/* Format the start date */}
                            <td>{formatDate(sprint.updatedDate)}</td> 
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            <nav aria-label="Page navigation example pt-3">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: Math.ceil(sprints.length / sprintsPerPage) }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === Math.ceil(sprints.length / sprintsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
            <SprintModal show={showModal} handleClose={handleCloseModal} projectId={projectId} />
        
        </div>
    );
}

export default Sprints;
