import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import '../../Style/TrafficMonitor.css';

const TrafficMonitor = () => {
  const [trafficData, setTrafficData] = useState({
    roads: [],
    intersections: [],
    events: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setLoading(true);
        const [roads, intersections, events] = await Promise.all([
          apiService.getRoads(),
          apiService.getIntersections(),
          apiService.getTrafficEvents()
        ]);
        
        setTrafficData({
          roads,
          intersections,
          events
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load traffic data');
        setLoading(false);
        console.error('Error fetching traffic data:', err);
      }
    };

    fetchTrafficData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchTrafficData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getCongestionColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) return <div className="loading">Loading traffic data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="traffic-monitor">
      <h2>Traffic Monitor</h2>
      
      <div className="traffic-stats">
        <div className="stat-card">
          <h3>Total Roads</h3>
          <p>{trafficData.roads.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <p>{trafficData.events.length}</p>
        </div>
        <div className="stat-card">
          <h3>Intersections</h3>
          <p>{trafficData.intersections.length}</p>
        </div>
      </div>

      <div className="traffic-grid">
        <div className="traffic-section">
          <h3>Roads</h3>
          <div className="road-list">
            {trafficData.roads.map(road => (
              <div key={road.id} className="road-item">
                <span className="road-name">{road.name}</span>
                <span className={`traffic-level ${road.trafficLevel}`}>
                  {road.trafficLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="traffic-section">
          <h3>Intersections</h3>
          <div className="intersection-list">
            {trafficData.intersections.map(intersection => (
              <div key={intersection.id} className="intersection-item">
                <span className="intersection-name">{intersection.name}</span>
                <span className={`status ${intersection.status}`}>
                  {intersection.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="traffic-section">
          <h3>Events</h3>
          <div className="event-list">
            {trafficData.events.map(event => (
              <div key={event.id} className="event-item">
                <span className="event-type">{event.type}</span>
                <span className={`severity ${event.severity}`}>
                  {event.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMonitor; 