import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import RoutePlanner from './RoutePlanner';
import AdminPanel from './AdminPanel';
import Login from './Login'; 
import ZonalThrottling from './ZonalThrottling'; 
import LaneMonitor from './DashBoard'; // ✅ Imported correctly
import TrafficMonitor from './components/TrafficMonitor';
import EventMonitor from './components/EventMonitor';
import Analytics from './components/Analytics';
import TrafficPrediction from './components/TrafficPrediction';
import '../Style/App.css'; // Import the App styles

// Protected route component
const ProtectedRoute = ({ element, adminOnly = false }) => {
  const userString = localStorage.getItem('user');
  
  // If no user is logged in, redirect to login
  if (!userString) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin-only route, check user role
  if (adminOnly) {
    const user = JSON.parse(userString);
    if (user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // If all checks pass, render the component
  return element;
};

function App() {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    setIsAuthenticated(!!userInfo);
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar isSimulationRunning={isSimulationRunning} />
        <div className="content-container">
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/route-planner" element={
              <ProtectedRoute element={<RoutePlanner />} />
            } />
            <Route path="/admin" element={
              <ProtectedRoute element={<AdminPanel />} adminOnly={true} />
            } />
            <Route path="/zonal" element={
              <ProtectedRoute element={<ZonalThrottling />} />
            } /> 
            <Route path="/dashboard" element={
              <ProtectedRoute element={<LaneMonitor />} />
            } />
            <Route path="/traffic-monitor" element={
              <ProtectedRoute element={<TrafficMonitor />} />
            } />
            <Route path="/event-monitor" element={
              <ProtectedRoute element={<EventMonitor />} />
            } />
            <Route path="/analytics" element={
              <ProtectedRoute element={<Analytics />} />
            } />
            <Route path="/traffic-prediction" element={
              <ProtectedRoute element={<TrafficPrediction />} />
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
