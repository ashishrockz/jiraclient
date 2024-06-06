// ./main/projects.js
import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import './style.css';
import ProjectModal from '../main/AddProject';
import axios from 'axios';

const Projects = () => {
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(8);
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

            const response = await axios.get('https://server-dk5b.onrender.com/api/project', {
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

    // Logic for pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = (projects || []).slice(indexOfFirstProject, indexOfLastProject);

    // Filter projects based on the search term
    const filteredProjects = currentProjects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between">
                <h4>Projects</h4>
                <button className="btn btn-primary" onClick={handleShowModal}>Create Project</button>
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
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Key</th>
                        <th scope="col">Type</th>
                        <th scope="col">U/D</th>

                    </tr>
                </thead>
                <tbody>
                    {filteredProjects.map((project, index) => (
                        <tr key={project._id}>
                            <th scope="row">{indexOfFirstProject + index + 1}</th>
                            <Link to ={{ pathname:`/project/${project._id}/sprint`}}>
                            <td>{project.name}</td>
                            </Link>
                            <td>{project.key}</td>
                            <td>{project.type}</td>
                            <td>
                                <div class="dropdown">
                                    <button class="nav-link dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-three-dots"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="/projects">Update</a></li>
                                        <li><button class="dropdown-item btn btn-link" type="button">Delete</button></li>
                                        </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr></hr>
            <nav aria-label="Page navigation example pt-3">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === Math.ceil(projects.length / projectsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
            <ProjectModal show={showModal} handleClose={handleCloseModal} onProjectCreated={fetchProjects} />
        </div>
    );
}

export default Projects;