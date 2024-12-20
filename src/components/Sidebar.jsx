import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaMapMarkedAlt, FaUsers, FaHome, FaCog } from 'react-icons/fa'; // Import icons
import './siba.css'
const Sidebar = () => (
  <div className="sidebar">
  <h3>Travel Admin Dashboard</h3>
  <Nav className="flex-column mt-2">
    <NavLink to="/admin_page/dashboard" className="nav-link" activeClassName="active">
      <FaTachometerAlt className="me-2" /> Dashboard
    </NavLink>
    <NavLink to="/admin_page/trip" className="nav-link" activeClassName="active">
      <FaMapMarkedAlt className="me-2" /> Trip Card
    </NavLink>
    <NavLink to="/admin_page/users" className="nav-link" activeClassName="active">
      <FaUsers className="me-2" /> Users Manager
    </NavLink>
    <NavLink to="/admin_page/home" className="nav-link" activeClassName="active">
      <FaHome className="me-2" /> Home-Card
    </NavLink>
    <NavLink to="/admin_page/setting" className="nav-link" activeClassName="active">
      <FaCog className="me-2" /> Setting
    </NavLink>
  </Nav>
  <div className="text-center">
    <img 
      src="https://img.upanh.tv/2024/11/12/applogo.png" 
      alt="Logo" 
      className="logo-img"
    />
  </div>
</div>


);

export default Sidebar;