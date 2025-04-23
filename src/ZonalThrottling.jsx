import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import '../Style/ZonalThrottling.css';

const ZonalThrottling = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch zones data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch roads data to get overall traffic statistics
        await apiService.getRoads();
        
        // Use the API endpoint instead of trying to fetch the file directly
        const mockZonesData = await fetch('http://localhost:5000/backend/data/traffic_data.json')
          .then(res => res.json())
          .then(data => data.zones)
          .catch(() => {
            // Fallback to hardcoded zones if fetch fails
            return [
              {
                id: "zone-1",
                name: "Temple District",
                boundaries: [
                  { x: 100, y: 100 },
                  { x: 300, y: 100 },
                  { x: 300, y: 300 },
                  { x: 100, y: 300 }
                ],
                throttleLevel: 0.3,
                maxCapacity: 500,
                currentVehicleCount: 320
              },
              {
                id: "zone-2",
                name: "Market Area",
                boundaries: [
                  { x: 350, y: 150 },
                  { x: 550, y: 150 },
                  { x: 550, y: 350 },
                  { x: 350, y: 350 }
                ],
                throttleLevel: 0.5,
                maxCapacity: 300,
                currentVehicleCount: 280
              },
              {
                id: "zone-3",
                name: "Residential Area",
                boundaries: [
                  { x: 100, y: 350 },
                  { x: 300, y: 350 },
                  { x: 300, y: 550 },
                  { x: 100, y: 550 }
                ],
                throttleLevel: 0.1,
                maxCapacity: 200,
                currentVehicleCount: 95
              }
            ];
          });
        
        setZones(mockZonesData);
        if (mockZonesData.length > 0) {
          setSelectedZone(mockZonesData[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load zones data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    setUpdateSuccess(false);
  };

  const handleThrottleChange = (e) => {
    const newThrottleLevel = parseFloat(e.target.value);
    setSelectedZone(prev => ({ ...prev, throttleLevel: newThrottleLevel }));
  };

  const handleApplyThrottling = async () => {
    if (!selectedZone) return;
    
    try {
      await apiService.setZonalThrottling(selectedZone.id, selectedZone.throttleLevel);
      
      // Update zones state
      setZones(prev => 
        prev.map(zone => 
          zone.id === selectedZone.id 
            ? { ...zone, throttleLevel: selectedZone.throttleLevel } 
            : zone
        )
      );
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update throttling level. Please try again.');
      console.error('Error updating throttling:', err);
    }
  };

  const getOccupancyPercentage = (zone) => {
    return Math.round((zone.currentVehicleCount / zone.maxCapacity) * 100);
  };

  const getOccupancyLevel = (zone) => {
    const percentage = getOccupancyPercentage(zone);
    if (percentage < 30) return 'low';
    if (percentage < 70) return 'medium';
    if (percentage < 90) return 'high';
    return 'critical';
  };

  const getThrottleLevelText = (level) => {
    if (level < 0.2) return 'Very Low';
    if (level < 0.4) return 'Low';
    if (level < 0.6) return 'Medium';
    if (level < 0.8) return 'High';
    return 'Very High';
  };

  if (loading) {
    return <div className="loading">Loading zones data...</div>;
  }

  return (
    <div className="zonal-throttling-container">
      <div className="zonal-throttling-header">
        <h2>Zonal Traffic Throttling</h2>
        <p>Manage and control traffic flow in different zones</p>
      </div>
      
      <div className="zonal-throttling-content">
        <div className="zones-list">
          <div className="zones-list-header">
            <h3>Traffic Zones</h3>
          </div>
          
          <div className="zones-items">
            {zones.map(zone => (
              <div 
                key={zone.id}
                className={`zone-item ${selectedZone && selectedZone.id === zone.id ? 'selected' : ''}`}
                onClick={() => handleSelectZone(zone)}
              >
                <div className="zone-name">{zone.name}</div>
                <div className="zone-occupancy">
                  <div 
                    className={`occupancy-indicator ${getOccupancyLevel(zone)}`}
                    style={{ width: `${getOccupancyPercentage(zone)}%` }}
                  ></div>
                  <div className="occupancy-text">
                    {getOccupancyPercentage(zone)}% Occupied
                  </div>
                </div>
                <div className="zone-throttle-level">
                  Throttle: {getThrottleLevelText(zone.throttleLevel)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedZone && (
          <div className="zone-control-panel">
            <div className="zone-control-header">
              <h3>{selectedZone.name}</h3>
              <div className={`zone-status ${getOccupancyLevel(selectedZone)}`}>
                {getOccupancyLevel(selectedZone).toUpperCase()}
              </div>
            </div>
            
            <div className="zone-stats">
              <div className="stat-item">
                <div className="stat-label">Current Vehicles</div>
                <div className="stat-value">{selectedZone.currentVehicleCount}</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Maximum Capacity</div>
                <div className="stat-value">{selectedZone.maxCapacity}</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Occupancy</div>
                <div className="stat-value">{getOccupancyPercentage(selectedZone)}%</div>
              </div>
            </div>
            
            <div className="throttle-control">
              <div className="throttle-label">
                <span>Traffic Throttling Level</span>
                <span>{(selectedZone.throttleLevel * 100).toFixed(0)}%</span>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={selectedZone.throttleLevel}
                onChange={handleThrottleChange}
                className="throttle-slider"
              />
              
              <div className="throttle-markers">
                <span>No Throttling</span>
                <span>Max Throttling</span>
              </div>
              
              <div className="throttle-description">
                <strong>Current Setting: {getThrottleLevelText(selectedZone.throttleLevel)}</strong>
                <p>
                  {selectedZone.throttleLevel < 0.3 
                    ? 'Low throttling allows most vehicles to enter the zone freely.'
                    : selectedZone.throttleLevel < 0.7 
                      ? 'Medium throttling restricts vehicle entry to manage congestion.'
                      : 'High throttling significantly reduces new vehicle entry to alleviate congestion.'}
                </p>
              </div>
              
              <button 
                className="apply-throttle-btn"
                onClick={handleApplyThrottling}
              >
                Apply Throttling
              </button>
              
              {updateSuccess && (
                <div className="success-message">
                  Throttling level updated successfully!
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
            
            <div className="recommended-action">
              <h4>Recommended Action</h4>
              <p>
                {getOccupancyPercentage(selectedZone) > 80
                  ? 'This zone is experiencing high traffic volume. Consider increasing throttling to reduce congestion.'
                  : getOccupancyPercentage(selectedZone) < 30
                    ? 'This zone has low traffic volume. Consider reducing throttling to improve accessibility.'
                    : 'This zone has moderate traffic volume. Current throttling appears appropriate.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZonalThrottling;