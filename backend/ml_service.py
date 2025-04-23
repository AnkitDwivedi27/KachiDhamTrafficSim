import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class TrafficPredictionService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.model_path = os.path.join(os.path.dirname(__file__), 'models', 'traffic_model.pkl')
        self.scaler_path = os.path.join(os.path.dirname(__file__), 'models', 'scaler.pkl')
        self.initialize_model()

    def initialize_model(self):
        # Create models directory if it doesn't exist
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        
        # Initialize model and scaler
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        
        # Generate training data
        training_data = self.generate_training_data()
        
        # Fit scaler and train model
        features = training_data.drop('congestion_level', axis=1)
        self.scaler.fit(features)
        features_scaled = self.scaler.transform(features)
        self.model.fit(features_scaled, training_data['congestion_level'])
        
        # Save the trained model and scaler
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        print("Model initialized and trained successfully")

    def generate_training_data(self):
        # Generate realistic training data
        np.random.seed(42)
        n_samples = 1000
        
        # Generate vehicle counts (0-100)
        vehicle_counts = np.random.randint(0, 101, n_samples)
        
        # Generate speeds (inversely related to vehicle count)
        speeds = np.maximum(20, 80 - (vehicle_counts * 0.6))
        
        # Generate congestion levels based on vehicle count and speed
        congestion_levels = np.zeros(n_samples)
        for i in range(n_samples):
            if vehicle_counts[i] < 20:
                congestion_levels[i] = 0  # low
            elif vehicle_counts[i] < 40:
                congestion_levels[i] = 1  # medium
            elif vehicle_counts[i] < 60:
                congestion_levels[i] = 2  # high
            else:
                congestion_levels[i] = 3  # severe
        
        # Generate time of day (0-23)
        time_of_day = np.random.randint(0, 24, n_samples)
        
        # Generate day of week (0-6)
        day_of_week = np.random.randint(0, 7, n_samples)
        
        return pd.DataFrame({
            'vehicle_count': vehicle_counts,
            'speed': speeds,
            'congestion_level': congestion_levels,
            'time_of_day': time_of_day,
            'day_of_week': day_of_week
        })

    def prepare_features(self, road_data):
        # Prepare features for prediction
        features = pd.DataFrame({
            'vehicle_count': [road_data.get('vehicleCount', 0)],
            'speed': [road_data.get('speed', 0)],
            'time_of_day': [self._get_time_of_day()],
            'day_of_week': [self._get_day_of_week()]
        })
        return self.scaler.transform(features)

    def predict_traffic(self, road_data):
        try:
            features = self.prepare_features(road_data)
            prediction = self.model.predict(features)[0]
            return {
                'predicted_congestion': self._map_prediction_to_level(prediction),
                'confidence': min(100, max(0, int(prediction * 100))),
                'suggested_action': self._get_suggested_action(prediction)
            }
        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            return {
                'predicted_congestion': 'unknown',
                'confidence': 0,
                'suggested_action': 'No prediction available'
            }

    def _map_congestion_level(self, level):
        level_map = {'low': 0, 'medium': 1, 'high': 2, 'severe': 3}
        return level_map.get(level.lower(), 0)

    def _map_prediction_to_level(self, prediction):
        if prediction < 0.25:
            return 'low'
        elif prediction < 0.5:
            return 'medium'
        elif prediction < 0.75:
            return 'high'
        else:
            return 'severe'

    def _get_suggested_action(self, prediction):
        if prediction < 0.25:
            return 'Normal traffic flow'
        elif prediction < 0.5:
            return 'Monitor traffic'
        elif prediction < 0.75:
            return 'Consider alternative routes'
        else:
            return 'Implement traffic control measures'

    def _get_time_of_day(self):
        from datetime import datetime
        return datetime.now().hour

    def _get_day_of_week(self):
        from datetime import datetime
        return datetime.now().weekday()

# Create a singleton instance
traffic_predictor = TrafficPredictionService() 