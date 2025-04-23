import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import '../../Style/Analytics.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    peakHours: [],
    congestionPatterns: [],
    eventTrends: [],
    roadUtilization: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [roads, events, intersections] = await Promise.all([
          apiService.getRoads(),
          apiService.getTrafficEvents(),
          apiService.getIntersections()
        ]);

        // Process data for analytics
        const processedData = processAnalyticsData(roads, events, intersections);
        setAnalyticsData(processedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics data');
        setLoading(false);
        console.error('Error fetching analytics data:', err);
      }
    };

    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const processAnalyticsData = (roads, events, intersections) => {
    // Calculate peak hours
    const peakHours = calculatePeakHours(roads);
    
    // Analyze congestion patterns
    const congestionPatterns = analyzeCongestionPatterns(roads);
    
    // Track event trends
    const eventTrends = analyzeEventTrends(events);
    
    // Calculate road utilization
    const roadUtilization = calculateRoadUtilization(roads);

    return {
      peakHours,
      congestionPatterns,
      eventTrends,
      roadUtilization
    };
  };

  const calculatePeakHours = (roads) => {
    // Implementation for peak hours calculation
    return [
      { hour: '08:00', traffic: 'High' },
      { hour: '12:00', traffic: 'Medium' },
      { hour: '17:00', traffic: 'High' }
    ];
  };

  const analyzeCongestionPatterns = (roads) => {
    // Implementation for congestion pattern analysis
    return roads.map(road => ({
      name: road.name,
      pattern: 'Morning Rush',
      severity: 'High'
    }));
  };

  const analyzeEventTrends = (events) => {
    // Implementation for event trend analysis
    return events.map(event => ({
      type: event.type,
      frequency: 'Daily',
      impact: event.severity
    }));
  };

  const calculateRoadUtilization = (roads) => {
    // Implementation for road utilization calculation
    return roads.map(road => ({
      name: road.name,
      utilization: '80%',
      capacity: 'High'
    }));
  };

  if (loading) return <div className="loading">Loading analytics data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Traffic Analytics Dashboard</h2>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Peak Hours Analysis</h3>
          <div className="peak-hours-chart">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={index} className="peak-hour-item">
                <span className="hour">{hour.hour}</span>
                <span className={`traffic-level ${hour.traffic.toLowerCase()}`}>
                  {hour.traffic}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Congestion Patterns</h3>
          <div className="congestion-patterns">
            {analyticsData.congestionPatterns.map((pattern, index) => (
              <div key={index} className="pattern-item">
                <span className="road-name">{pattern.name}</span>
                <span className="pattern">{pattern.pattern}</span>
                <span className={`severity ${pattern.severity.toLowerCase()}`}>
                  {pattern.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Event Trends</h3>
          <div className="event-trends">
            {analyticsData.eventTrends.map((trend, index) => (
              <div key={index} className="trend-item">
                <span className="event-type">{trend.type}</span>
                <span className="frequency">{trend.frequency}</span>
                <span className={`impact ${trend.impact.toLowerCase()}`}>
                  {trend.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Road Utilization</h3>
          <div className="road-utilization">
            {analyticsData.roadUtilization.map((road, index) => (
              <div key={index} className="utilization-item">
                <span className="road-name">{road.name}</span>
                <div className="utilization-bar">
                  <div 
                    className="utilization-fill" 
                    style={{ width: road.utilization }}
                  ></div>
                </div>
                <span className="capacity">{road.capacity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 