// API service for communicating with the backend

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Authentication
  login: async (credentials) => {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Traffic Data
  getRoads: async () => {
    const response = await fetch(`${API_BASE_URL}/traffic/roads`);
    return response.json();
  },
  
  getIntersections: async () => {
    const response = await fetch(`${API_BASE_URL}/traffic/intersections`);
    return response.json();
  },
  
  getTrafficEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/traffic/events`);
    return response.json();
  },
  
  addTrafficEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/traffic/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  },
  
  deleteTrafficEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/traffic/events/${eventId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  updateTrafficLight: async (lightId, phase) => {
    const response = await fetch(`${API_BASE_URL}/traffic/lights/${lightId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phase }),
    });
    return response.json();
  },
  
  // Route Planning
  planRoute: async (origin, destination) => {
    const response = await fetch(`${API_BASE_URL}/route/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ origin, destination }),
    });
    return response.json();
  },
  
  // Zonal Throttling
  setZonalThrottling: async (zoneId, throttleLevel) => {
    const response = await fetch(`${API_BASE_URL}/zonal/throttle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ zoneId, throttleLevel }),
    });
    return response.json();
  },

  async getTrafficPrediction(roadId) {
    const response = await fetch(`${API_BASE_URL}/traffic/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ road_id: roadId })
    });

    if (!response.ok) {
      throw new Error('Failed to get traffic prediction');
    }

    return response.json();
  },

  getZonePoints: async (zoneId) => {
    const response = await fetch(`${API_BASE_URL}/zonal/points/${zoneId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  updateZonePoint: async (pointId, updates) => {
    const response = await fetch(`${API_BASE_URL}/zonal/points/${pointId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updates)
    });
    return response.json();
  }
}; 