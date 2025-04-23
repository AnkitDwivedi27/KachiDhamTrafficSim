import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Style/Navbar.css';

const Navbar = ({ isSimulationRunning }) => {
  const location = useLocation();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setIsUserLoggedIn(true);
      setIsAdmin(user.role === 'admin');
      setUsername(user.email_or_username);
    }
  }, []);
  
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('user');
    
    // Update state
    setIsUserLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/">Kachi Dham Traffic Simulator</Link>
        <span className={`status-indicator ${isSimulationRunning ? 'active' : 'inactive'}`}>
          {isSimulationRunning ? 'Running' : 'Paused'}
        </span>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/traffic-prediction">Traffic Prediction</Link>
        <Link to="/route-planner">Route Planner</Link>
        <Link to="/zonal">Zonal Throttling</Link>
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
      </div>
      
      <div className="user-section">
        {isUserLoggedIn ? (
          <div className="user-info">
            <span className="username">{username}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
