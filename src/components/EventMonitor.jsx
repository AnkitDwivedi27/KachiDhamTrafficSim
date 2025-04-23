import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';


const EventMonitor = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('severity');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await apiService.getTrafficEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getEventIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'accident': return '🚗';
      case 'road_work': return '🚧';
      case 'special_event': return '🎉';
      case 'weather': return '⛈️';
      case 'congestion': return '🚦';
      default: return '⚠️';
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type.toLowerCase() === filter;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'severity') {
      const severityOrder = { 'severe': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return severityOrder[b.severity.toLowerCase()] - severityOrder[a.severity.toLowerCase()];
    }
    return new Date(b.startTime) - new Date(a.startTime);
  });

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-monitor">
      <div className="event-header">
        <h2>Event Monitoring</h2>
        <div className="controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Events</option>
            <option value="accident">Accidents</option>
            <option value="road_work">Road Work</option>
            <option value="special_event">Special Events</option>
            <option value="weather">Weather</option>
            <option value="congestion">Congestion</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="severity">Sort by Severity</option>
            <option value="time">Sort by Time</option>
          </select>
        </div>
      </div>

      <div className="event-stats">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{events.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <p>{events.filter(e => new Date(e.endTime) > new Date()).length}</p>
        </div>
        <div className="stat-card">
          <h3>High Severity</h3>
          <p>{events.filter(e => e.severity.toLowerCase() === 'high' || e.severity.toLowerCase() === 'severe').length}</p>
        </div>
      </div>

      <div className="events-grid">
        {sortedEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-icon">{getEventIcon(event.type)}</div>
            <div className="event-content">
              <div className="event-header">
                <h3>{event.type.replace('_', ' ')}</h3>
                <span className="severity-badge" 
                      style={{ backgroundColor: getSeverityColor(event.severity) }}>
                  {event.severity}
                </span>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <div className="detail-item">
                  <span className="label">Start:</span>
                  <span className="value">{new Date(event.startTime).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">End:</span>
                  <span className="value">{new Date(event.endTime).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">X: {event.location.x}, Y: {event.location.y}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Affected Roads:</span>
                  <span className="value">{event.affectedRoadIds.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventMonitor; 