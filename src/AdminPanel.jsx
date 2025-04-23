import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { 
  TRAFFIC_EVENT_TYPE,
  EVENT_SEVERITY
} from "./assets/data/kachiDhamData";
import '../Style/AdminDashBoard.css';

const AdminPanel = () => {
  const [trafficLights, setTrafficLights] = useState([]);
  const [roads, setRoads] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: TRAFFIC_EVENT_TYPE.ROAD_WORK,
    description: '',
    roadId: '',
    severity: EVENT_SEVERITY.MEDIUM,
    startTime: '',
    endTime: ''
  });
  
  // Fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch roads
        const roadsData = await apiService.getRoads();
        setRoads(roadsData);
        
        // Fetch intersections with traffic lights
        const intersectionsData = await apiService.getIntersections();
        setTrafficLights(intersectionsData.filter(intersection => intersection.hasTrafficLight));
        
        // Fetch traffic events
        const eventsData = await apiService.getTrafficEvents();
        setEvents(eventsData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate statistics
  const totalVehicles = roads.reduce((sum, road) => sum + road.vehicleCount, 0);
  const congestionPercentage = Math.round(
    (roads.filter(road => 
      road.congestionLevel === 'high' || road.congestionLevel === 'severe'
    ).length / (roads.length || 1)) * 100
  );
  
  // Handle traffic light phase change
  const handleLightChange = async (id, phase) => {
    try {
      await apiService.updateTrafficLight(id, phase);
      
      // Update local state
      setTrafficLights(prevLights => 
        prevLights.map(light => 
          light.id === id ? { ...light, currentPhase: phase } : light
        )
      );
    } catch (err) {
      console.error('Error updating traffic light:', err);
      setError('Failed to update traffic light. Please try again.');
    }
  };
  
  // Handle removing a traffic event
  const handleRemoveEvent = async (id) => {
    try {
      await apiService.deleteTrafficEvent(id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error removing event:', err);
      setError('Failed to remove event. Please try again.');
    }
  };
  
  // Handle changes to new event form
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle submitting a new event
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...newEvent,
        location: { x: 0, y: 0 },
        affectedRoadIds: [newEvent.roadId]
      };
      
      const createdEvent = await apiService.addTrafficEvent(eventData);
      
      // Update local state with the new event
      setEvents(prev => [...prev, createdEvent]);
      
      // Reset form
      setNewEvent({
        type: TRAFFIC_EVENT_TYPE.ROAD_WORK,
        description: '',
        roadId: '',
        severity: EVENT_SEVERITY.MEDIUM,
        startTime: '',
        endTime: ''
      });
      
      setShowAddEventForm(false);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event. Please try again.');
    }
  };
  
  // Format date time for input fields
  const formatDateTimeForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  // Initialize date/time if not set
  useEffect(() => {
    if (!newEvent.startTime) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + 2);
      
      setNewEvent(prev => ({
        ...prev, 
        startTime: formatDateTimeForInput(startDate),
        endTime: formatDateTimeForInput(endDate)
      }));
    }
  }, [newEvent.startTime]);
  
  if (loading) {
    return <div className="loading">Loading data...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="page-container">
      <div className="admin-container">
        <div className="admin-header">
          <h2 className="admin-title">Traffic Control Admin Dashboard</h2>
        </div>
        
        <div className="admin-stats-cards">
          <div className="stats-card">
            <h3>Total Vehicles</h3>
            <div className="stat">{totalVehicles}</div>
            <div className="subtitle">Currently in the network</div>
          </div>
          
          <div className="stats-card">
            <h3>Traffic Congestion</h3>
            <div className="stat">{congestionPercentage}%</div>
            <div className="subtitle">Roads with high congestion</div>
          </div>
          
          <div className="stats-card">
            <h3>Active Traffic Lights</h3>
            <div className="stat">{trafficLights.length}</div>
            <div className="subtitle">Operational traffic signals</div>
          </div>
          
          <div className="stats-card">
            <h3>Active Events</h3>
            <div className="stat">{events.length}</div>
            <div className="subtitle">Traffic events in progress</div>
          </div>
        </div>
        
        <div className="admin-panels">
          <div className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Traffic Light Control</h3>
            </div>
            
            <div className="traffic-light-controls">
              {trafficLights.map(light => (
                <div className="traffic-light-item" key={light.id}>
                  <div className="traffic-light-info">
                    <div className="traffic-light-name">Intersection {light.id.split('-')[1]}</div>
                    <div className="traffic-light-location">
                      Connected roads: {light.connectedRoads.length}
                    </div>
                  </div>
                  
                  <div className="traffic-light-status">
                    <button 
                      className={`light-button red ${light.currentPhase === 'red' ? 'active' : ''}`}
                      onClick={() => handleLightChange(light.id, 'red')}
                    ></button>
                    <button 
                      className={`light-button yellow ${light.currentPhase === 'yellow' ? 'active' : ''}`}
                      onClick={() => handleLightChange(light.id, 'yellow')}
                    ></button>
                    <button 
                      className={`light-button green ${light.currentPhase === 'green' ? 'active' : ''}`}
                      onClick={() => handleLightChange(light.id, 'green')}
                    ></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Traffic Events</h3>
              <button 
                className="panel-action"
                onClick={() => setShowAddEventForm(!showAddEventForm)}
              >
                {showAddEventForm ? 'Cancel' : 'Add Event'}
              </button>
            </div>
            
            {showAddEventForm ? (
              <form className="add-event-form" onSubmit={handleSubmitEvent}>
                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select 
                    className="form-select"
                    name="type" 
                    value={newEvent.type}
                    onChange={handleNewEventChange}
                    required
                  >
                    <option value={TRAFFIC_EVENT_TYPE.ROAD_WORK}>Road Work</option>
                    <option value={TRAFFIC_EVENT_TYPE.ACCIDENT}>Accident</option>
                    <option value={TRAFFIC_EVENT_TYPE.SPECIAL_EVENT}>Special Event</option>
                    <option value={TRAFFIC_EVENT_TYPE.WEATHER}>Weather Condition</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input 
                    type="text"
                    className="form-input"
                    name="description"
                    value={newEvent.description}
                    onChange={handleNewEventChange}
                    placeholder="Enter event description"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Affected Road</label>
                  <select 
                    className="form-select"
                    name="roadId"
                    value={newEvent.roadId}
                    onChange={handleNewEventChange}
                    required
                  >
                    <option value="">Select a road</option>
                    {roads.map(road => (
                      <option key={road.id} value={road.id}>
                        {road.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select 
                    className="form-select"
                    name="severity"
                    value={newEvent.severity}
                    onChange={handleNewEventChange}
                    required
                  >
                    <option value={EVENT_SEVERITY.LOW}>Low</option>
                    <option value={EVENT_SEVERITY.MEDIUM}>Medium</option>
                    <option value={EVENT_SEVERITY.HIGH}>High</option>
                    <option value={EVENT_SEVERITY.SEVERE}>Severe</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input 
                      type="datetime-local"
                      className="form-input"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleNewEventChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input 
                      type="datetime-local"
                      className="form-input"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleNewEventChange}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Add Event</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowAddEventForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="events-list">
                {events.length === 0 ? (
                  <div className="no-events">No traffic events to display</div>
                ) : (
                  events.map(event => (
                    <div className="event-item" key={event.id}>
                      <div className="event-header">
                        <span className={`event-type ${event.type.toLowerCase()}`}>
                          {event.type}
                        </span>
                        <span className={`event-severity ${event.severity.toLowerCase()}`}>
                          {event.severity}
                        </span>
                      </div>
                      
                      <div className="event-description">
                        {event.description}
                      </div>
                      
                      <div className="event-details">
                        <div className="event-road">
                          Affected road: {roads.find(r => r.id === event.affectedRoadIds[0])?.name || event.affectedRoadIds[0]}
                        </div>
                        
                        <div className="event-timing">
                          <div>Start: {new Date(event.startTime).toLocaleString()}</div>
                          {event.endTime && <div>End: {new Date(event.endTime).toLocaleString()}</div>}
                        </div>
                      </div>
                      
                      <button 
                        className="remove-event-btn"
                        onClick={() => handleRemoveEvent(event.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;