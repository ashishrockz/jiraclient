// ./main/projects.js
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './style.css';
import './table.css';
// import { FiMoreHorizontal } from "react-icons/fi";
import ProjectModal from '../main/AddProject';
import axios from 'axios';

const Projects = () => {
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage");
            }

            console.log('Fetching projects with token:', token);

            const response = await axios.get('https://server-omega-umber.vercel.app/api/project', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('API response:', response);

            if (response.data && response.data.projects) {
                setProjects(response.data.projects);
            } else if (Array.isArray(response.data)) {
                setProjects(response.data);
            } else {
                throw new Error("Unexpected response structure");
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        }
    };

    // Filter projects based on the search term
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logic for pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between">
                <h6>Projects</h6>
                <button className="btn btn-primary" onClick={handleShowModal}>Create Project</button>
            </div>
            <div className="form-inline mt-3 mb-2">
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {currentProjects.map((project, index) => {
                if (index % 2 === 0) {
                    return (
                        <div className="row" key={index}>
                            <div className="col-sm-6">
                                <div className="card mb-2">
                                    <div className="card-body">
                                        <h5>{project.name}</h5>
                                        <p className="card-text">Key: {project.key}</p>
                                        <p className="card-text">{project.type}</p>
                                        <Link to={{ pathname: `/project/${project._id}/sprint` }} className="btn btn-primary">View</Link>
                                    </div>
                                </div>
                            </div>
                            {currentProjects[index + 1] && (
                                <div className="col-sm-6">
                                    <div className="card mb-2">
                                        <div className="card-body">
                                            <h5>{currentProjects[index + 1].name}</h5>
                                            <p className="card-text">Key: {currentProjects[index + 1].key}</p>
                                            <p className="card-text">{currentProjects[index + 1].type}</p>
                                            <Link to={{ pathname: `/project/${currentProjects[index + 1]._id}/sprint` }} className="btn btn-primary">View</Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }
                return null;
            })}
            <nav aria-label="Page navigation example" className='mt-1 bt-1'>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === Math.ceil(filteredProjects.length / projectsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
            <ProjectModal show={showModal} handleClose={handleCloseModal} onProjectCreated={fetchProjects} />
        </div>
    );
}

export default Projects;
