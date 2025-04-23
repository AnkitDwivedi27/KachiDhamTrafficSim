import React, { useState, useEffect } from 'react';

import '../Style/DashBoard.css';

const LaneMonitor = () => {
  const [timeRange, setTimeRange] = useState('hour');
  const [laneData, setLaneData] = useState({
    lane1: { cars: 0, buses: 0, trucks: 0, motorcycles: 0, emergency: 0 },
    lane2: { cars: 0, buses: 0, trucks: 0, motorcycles: 0, emergency: 0 },
    lane3: { cars: 0, buses: 0, trucks: 0, motorcycles: 0, emergency: 0 },
    lane4: { cars: 0, buses: 0, trucks: 0, motorcycles: 0, emergency: 0 },
    lane5: { cars: 0, buses: 0, trucks: 0, motorcycles: 0, emergency: 0 },
    lane6: { cars: 0, buses: 0, trucks: 0, motorcycles: 0, emergency: 0 }
  });

  // Simulate vehicle count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLaneData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(lane => {
          newData[lane] = {
            cars: Math.floor(Math.random() * 100),
            buses: Math.floor(Math.random() * 20),
            trucks: Math.floor(Math.random() * 15),
            motorcycles: Math.floor(Math.random() * 50),
            emergency: Math.floor(Math.random() * 5)
          };
        });
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const renderLaneCard = (laneId, data) => (
    <div className="lane-card" key={laneId}>
      <h3 className="lane-title">Lane {laneId.replace('lane', '')}</h3>
      <div className="count-container">
        <span className="count-label">Cars:</span>
        <span className="count-value count-update">{data.cars}/hour</span>
      </div>
      <div className="count-container">
        <span className="count-label">Buses:</span>
        <span className="count-value count-update">{data.buses}/hour</span>
      </div>
      <div className="count-container">
        <span className="count-label">Trucks:</span>
        <span className="count-value count-update">{data.trucks}/hour</span>
      </div>
      <div className="count-container">
        <span className="count-label">Motorcycles:</span>
        <span className="count-value count-update">{data.motorcycles}/hour</span>
      </div>
      <div className="count-container">
        <span className="count-label">Emergency:</span>
        <span className="count-value count-update">{data.emergency}/hour</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Lane Traffic Monitor</h2>
      <div className="time-selector">
        <button 
          className={`time-button ${timeRange === 'hour' ? 'active' : ''}`}
          onClick={() => setTimeRange('hour')}
        >
          Per Hour
        </button>
        <button 
          className={`time-button ${timeRange === 'day' ? 'active' : ''}`}
          onClick={() => setTimeRange('day')}
        >
          Per Day
        </button>
        <button 
          className={`time-button ${timeRange === 'week' ? 'active' : ''}`}
          onClick={() => setTimeRange('week')}
        >
          Per Week
        </button>
      </div>
      <div className="lane-grid">
        {Object.entries(laneData).map(([laneId, data]) => 
          renderLaneCard(laneId, data)
        )}
      </div>
    </div>
  );
};

export default LaneMonitor;