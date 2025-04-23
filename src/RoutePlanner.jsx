import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import '../Style/RoutePlanner.css';

const RoutePlanner = () => {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isPlanning, setIsPlanning] = useState(false);

  // Fetch roads data from backend when component mounts
  useEffect(() => {
    const fetchRoads = async () => {
      try {
        setLoading(true);
        const roadsData = await apiService.getRoads();
        setRoads(roadsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load roads data. Please try again later.');
        setLoading(false);
        console.error('Error fetching roads:', err);
      }
    };

    fetchRoads();
    
    // Set default departure time to now
    const now = new Date();
    setDepartureTime(formatDateTimeForInput(now));
  }, []);

  // Format date time for input fields
  const formatDateTimeForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handlePlanRoute = async (e) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      return;
    }
    
    try {
      setIsPlanning(true);
      setSelectedRoute(null);
      
      const response = await apiService.planRoute(origin, destination);
      
      if (response.success) {
        // In a real app, we would get multiple route options
        // Here we'll create some mock alternatives based on the single route we get
        
        const mainRoute = response.route;
        
        const routeOptions = [
          {
            id: 'route-1',
            name: 'Fastest Route',
            distance: mainRoute.distance,
            duration: mainRoute.duration,
            trafficLevel: 'moderate',
            path: mainRoute.path
          },
          {
            id: 'route-2',
            name: 'Alternative Route',
            distance: Math.round((mainRoute.distance * 1.2) * 10) / 10,
            duration: Math.round(mainRoute.duration * 0.9),
            trafficLevel: 'light',
            path: [...mainRoute.path].reverse() // Just for demonstration
          },
          {
            id: 'route-3',
            name: 'Scenic Route',
            distance: Math.round((mainRoute.distance * 1.5) * 10) / 10,
            duration: Math.round(mainRoute.duration * 1.3),
            trafficLevel: 'light',
            path: mainRoute.path.slice(0, 1).concat(['road-4']).concat(mainRoute.path.slice(-1))
          }
        ];
        
        setRouteOptions(routeOptions);
        setSelectedRoute(routeOptions[0]);
      } else {
        setError('Could not plan a route. Please try different locations.');
      }
    } catch (err) {
      setError('Failed to plan route. Please try again later.');
      console.error('Error planning route:', err);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="route-planner-container">
      <div className="route-planner-header">
        <h2>Route Planner</h2>
        <p>Plan your journey through Kachi Dham</p>
      </div>
      
      <div className="route-planner-content">
        <div className="route-planner-form-container">
          <form className="route-form" onSubmit={handlePlanRoute}>
            <div className="form-group">
              <label htmlFor="origin">Origin</label>
              <select
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              >
                <option value="">Select starting point</option>
                {roads.map(road => (
                  <option key={`origin-${road.id}`} value={road.id}>
                    {road.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              >
                <option value="">Select destination</option>
                {roads.map(road => (
                  <option key={`dest-${road.id}`} value={road.id}>
                    {road.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="departure-time">Departure Time</label>
              <input
                type="datetime-local"
                id="departure-time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group form-actions">
              <button 
                type="submit" 
                className="plan-route-btn"
                disabled={isPlanning || !origin || !destination}
              >
                {isPlanning ? 'Planning...' : 'Plan Route'}
              </button>
            </div>
          </form>
          
          {error && <div className="error-message">{error}</div>}
        </div>
        
        {routeOptions.length > 0 && (
          <div className="route-options-container">
            <h3>Available Routes</h3>
            
            <div className="route-options">
              {routeOptions.map(route => (
                <div 
                  key={route.id}
                  className={`route-option ${selectedRoute && selectedRoute.id === route.id ? 'selected' : ''}`}
                  onClick={() => handleSelectRoute(route)}
                >
                  <div className="route-name">{route.name}</div>
                  <div className="route-info">
                    <div className="route-distance">{route.distance} km</div>
                    <div className="route-duration">{route.duration} min</div>
                    <div className={`route-traffic-level ${route.trafficLevel}`}>
                      {route.trafficLevel.charAt(0).toUpperCase() + route.trafficLevel.slice(1)} Traffic
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedRoute && (
              <div className="selected-route-details">
                <h4>Route Details</h4>
                
                <div className="route-summary">
                  <div className="summary-item">
                    <div className="summary-label">Distance</div>
                    <div className="summary-value">{selectedRoute.distance} km</div>
                  </div>
                  
                  <div className="summary-item">
                    <div className="summary-label">Duration</div>
                    <div className="summary-value">{selectedRoute.duration} min</div>
                  </div>
                  
                  <div className="summary-item">
                    <div className="summary-label">Traffic Conditions</div>
                    <div className={`summary-value traffic-${selectedRoute.trafficLevel}`}>
                      {selectedRoute.trafficLevel.charAt(0).toUpperCase() + selectedRoute.trafficLevel.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div className="route-path">
                  <div className="route-path-header">Route Path</div>
                  <div className="path-list">
                    {selectedRoute.path.map((roadId, index) => {
                      const road = roads.find(r => r.id === roadId) || { name: roadId };
                      return (
                        <div key={`path-${index}`} className="path-item">
                          <div className="path-step">{index + 1}</div>
                          <div className="path-road">{road.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <button className="start-navigation-btn">
                  Start Navigation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;