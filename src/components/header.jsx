import React, { useState } from 'react';
import './style.css';
import { IoLogOutOutline } from "react-icons/io5";
import logo from './logo.png';
import picture from './gg.jpg';
import axios from 'axios';
import ProjectModal from '../main/AddProject'; // Adjust this path if necessary
import Profile from '../main/profile';

const Header = ({ isAuthenticated, onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [showprofile, setProfile] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/auth/logout");
      localStorage.removeItem('token');
      window.location = "/login";
      onLogout();
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred during logout. Please try again.");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleshowprofile = () => setProfile(true);
  const handlecloseprofile = () => setProfile(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <a className="navbar-brand" href="/">
        <img src={logo} width="30" height="30" className="d-inline-block align-top" alt=""/>
        Jira
      </a>
      {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button> */}
      {/* <div className="collapse navbar-collapse" id="navbarNav"> */}
        <ul className="navbar-nav">
          {/* <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li> */}
          <li className="nav-item">
            <div className="dropdown">
              <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" data-display="static" aria-haspopup="true" aria-expanded="false">
            Project
              </button>
              <div class="dropdown-menu dropdown-menu-sm-left">
              <><a className="nav-link" href="/projects">View all</a></>
              <div className="dropdown-divider"></div>

                <><button className="nav-link btn btn-link" onClick={handleShowModal}>Create Project</button></>
              </div>
            </div>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link" href="/addissue">Create Issue</a>
          </li> */}
        </ul>
      {/* </div> */}
      <div className="ml-auto">
        <ul className="navbar-nav">
          {isAuthenticated ? (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown" href={() => false} id="profileDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={picture} width="30" height="30" className="rounded-circle" alt="Profile"/>
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="profileDropdown">
                <button className="dropdown-item" href={() => false} onClick={handleshowprofile}>Profile</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" href={() => false} onClick={handleLogout}><IoLogOutOutline/>Logout</button>
              </div>
            </li>
          ) : (
            <div className="authheader">
              <li className="nav-item p-2">
                <a className="nav-link" href="/login">Login</a>
              </li>
              <li className="nav-item p-2">
                <a className="nav-link" href="/signup">Signup</a>
              </li>
            </div>
          )}
        </ul>
      </div>
      <ProjectModal show={showModal} handleClose={handleCloseModal} />
      <Profile show={showprofile} handleClose={handlecloseprofile}/>
    </nav>
  );
};

export default Header;
