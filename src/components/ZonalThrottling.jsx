import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import '../../Style/ZonalThrottling.css';

const ZonalThrottling = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [entryPoints, setEntryPoints] = useState([]);
  const [exitPoints, setExitPoints] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchZones();
    const interval = setInterval(fetchZones, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const zonesData = await apiService.getZones();
      setZones(zonesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load zones');
      setLoading(false);
      console.error('Error fetching zones:', err);
    }
  };

  const handleZoneSelect = async (zone) => {
    setSelectedZone(zone);
    setUpdateSuccess(false);
    // Fetch entry and exit points for the selected zone
    await fetchZonePoints(zone.id);
  };

  const fetchZonePoints = async (zoneId) => {
    try {
      const points = await apiService.getZonePoints(zoneId);
      setEntryPoints(points.filter(point => point.type === 'entry'));
      setExitPoints(points.filter(point => point.type === 'exit'));
    } catch (err) {
      console.error('Error fetching zone points:', err);
    }
  };

  const handlePointUpdate = async (pointId, updates) => {
    try {
      await apiService.updateZonePoint(pointId, updates);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      // Refresh points after update
      if (selectedZone) {
        await fetchZonePoints(selectedZone.id);
      }
    } catch (err) {
      setError('Failed to update point settings');
      console.error('Error updating point:', err);
    }
  };

  const handleCapacityChange = async (pointId, newCapacity) => {
    await handlePointUpdate(pointId, { capacity: newCapacity });
  };

  const handleStatusChange = async (pointId, newStatus) => {
    await handlePointUpdate(pointId, { status: newStatus });
  };

  if (loading) return <div className="loading">Loading zones...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="zonal-throttling">
      <div className="zones-header">
        <h2>Zonal Traffic Control</h2>
        <div className="zone-selector">
          <select 
            value={selectedZone?.id || ''} 
            onChange={(e) => {
              const zone = zones.find(z => z.id === e.target.value);
              handleZoneSelect(zone);
            }}
          >
            <option value="">Select a Zone</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedZone && (
        <div className="zone-controls">
          <div className="control-section">
            <h3>Entry Points</h3>
            <div className="points-grid">
              {entryPoints.map(point => (
                <div key={point.id} className="control-card">
                  <div className="control-header">
                    <h4>{point.name}</h4>
                    <span className={`status ${point.status}`}>
                      {point.status}
                    </span>
                  </div>
                  <div className="control-details">
                    <div className="detail-item">
                      <span className="label">Type:</span>
                      <span className="value">{point.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Capacity:</span>
                      <div className="capacity-control">
                        <input
                          type="number"
                          value={point.capacity}
                          onChange={(e) => handleCapacityChange(point.id, parseInt(e.target.value))}
                          min="0"
                          max="1000"
                        />
                        <span className="unit">vehicles/hour</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="label">Current Flow:</span>
                      <span className="value">{point.currentFlow} vehicles/hour</span>
                    </div>
                  </div>
                  <div className="control-actions">
                    <button
                      className={`action-button ${point.status === 'open' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(point.id, 'open')}
                    >
                      Open
                    </button>
                    <button
                      className={`action-button ${point.status === 'restricted' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(point.id, 'restricted')}
                    >
                      Restricted
                    </button>
                    <button
                      className={`action-button ${point.status === 'closed' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(point.id, 'closed')}
                    >
                      Closed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>Exit Points</h3>
            <div className="points-grid">
              {exitPoints.map(point => (
                <div key={point.id} className="control-card">
                  <div className="control-header">
                    <h4>{point.name}</h4>
                    <span className={`status ${point.status}`}>
                      {point.status}
                    </span>
                  </div>
                  <div className="control-details">
                    <div className="detail-item">
                      <span className="label">Type:</span>
                      <span className="value">{point.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Capacity:</span>
                      <div className="capacity-control">
                        <input
                          type="number"
                          value={point.capacity}
                          onChange={(e) => handleCapacityChange(point.id, parseInt(e.target.value))}
                          min="0"
                          max="1000"
                        />
                        <span className="unit">vehicles/hour</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="label">Current Flow:</span>
                      <span className="value">{point.currentFlow} vehicles/hour</span>
                    </div>
                  </div>
                  <div className="control-actions">
                    <button
                      className={`action-button ${point.status === 'open' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(point.id, 'open')}
                    >
                      Open
                    </button>
                    <button
                      className={`action-button ${point.status === 'restricted' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(point.id, 'restricted')}
                    >
                      Restricted
                    </button>
                    <button
                      className={`action-button ${point.status === 'closed' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(point.id, 'closed')}
                    >
                      Closed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {updateSuccess && (
            <div className="success-message">
              Settings updated successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZonalThrottling; 