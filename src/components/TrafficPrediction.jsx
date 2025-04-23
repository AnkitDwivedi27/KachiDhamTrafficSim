import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import '../../Style/TrafficPrediction.css';

const TrafficPrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState('');

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedRoad]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const roads = await apiService.getRoads();
      
      if (selectedRoad) {
        const prediction = await apiService.getTrafficPrediction(selectedRoad);
        setPredictions([prediction]);
      } else {
        const predictions = await Promise.all(
          roads.map(road => apiService.getTrafficPrediction(road.id))
        );
        setPredictions(predictions);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load predictions');
      setLoading(false);
      console.error('Error fetching predictions:', err);
    }
  };

  const getPredictionColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) return <div className="loading">Loading predictions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="traffic-prediction">
      <div className="prediction-header">
        <h2>Traffic Predictions</h2>
        <select 
          value={selectedRoad} 
          onChange={(e) => setSelectedRoad(e.target.value)}
          className="road-selector"
        >
          <option value="">All Roads</option>
          {predictions.map(prediction => (
            <option key={prediction.road_id} value={prediction.road_id}>
              Road {prediction.road_id}
            </option>
          ))}
        </select>
      </div>

      <div className="predictions-grid">
        {predictions.map(prediction => (
          <div key={prediction.road_id} className="prediction-card">
            <div className="card-header">
              <h3>Road {prediction.road_id}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getPredictionColor(prediction.prediction.predicted_congestion) }}
              >
                {prediction.prediction.predicted_congestion}
              </span>
            </div>

            <div className="current-status">
              <h4>Current Status</h4>
              <div className="status-details">
                <div className="detail-item">
                  <span className="label">Vehicles:</span>
                  <span className="value">{prediction.current_status.vehicle_count}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Speed:</span>
                  <span className="value">{prediction.current_status.speed} km/h</span>
                </div>
                <div className="detail-item">
                  <span className="label">Congestion:</span>
                  <span className="value">{prediction.current_status.congestion_level}</span>
                </div>
              </div>
            </div>

            <div className="prediction-details">
              <h4>Prediction</h4>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill"
                  style={{ width: `${prediction.prediction.confidence}%` }}
                ></div>
                <span className="confidence-value">{prediction.prediction.confidence}%</span>
              </div>
              <p className="suggestion">{prediction.prediction.suggested_action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficPrediction; 