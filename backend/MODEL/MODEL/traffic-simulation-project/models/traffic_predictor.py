import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import StandardScaler
import numpy as np

class TrafficPredictor:
    def __init__(self):
        """
        Initializes the TrafficPredictor class and prepares the model.
        """
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()

    def preprocess_data(self, data: pd.DataFrame):
        """
        Preprocess the traffic data (e.g., encoding, scaling).
        :param data: Traffic dataset
        :return: Preprocessed features (X) and target variable (y)
        """
        # Features: Use relevant features like 'hour', 'day', 'weather', 'road_id', etc.
        features = data[['hour', 'day', 'weather', 'road_id', 'traffic_volume']]
        target = data['predicted_speed']  # Target: predicted traffic speed
        
        # Scaling the features
        features_scaled = self.scaler.fit_transform(features)
        
        return features_scaled, target

    def fit(self, data: pd.DataFrame):
        """
        Train the traffic prediction model.
        :param data: Traffic dataset
        """
        # Preprocess data
        X, y = self.preprocess_data(data)
        
        # Split the data into training and testing sets (80-20 split)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train the RandomForestRegressor model
        self.model.fit(X_train, y_train)
        
        # Evaluate the model
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        print(f"Model trained successfully! Mean Absolute Error: {mae:.2f}")
        
    def predict(self, data: pd.DataFrame):
        """
        Predict traffic speed based on the input data.
        :param data: Input dataset for predictions (without 'predicted_speed' column)
        :return: Predicted traffic speeds
        """
        # Preprocess the data
        features_scaled, _ = self.preprocess_data(data)
        
        # Predict traffic speed using the trained model
        predictions = self.model.predict(features_scaled)
        
        # Return predicted traffic speed and append it as a new column to the dataframe
        data['predicted_speed'] = predictions
        
        return data

    def predict_single(self, input_features: dict):
        """
        Predict traffic speed for a single set of features.
        :param input_features: Dictionary of input features for prediction
        :return: Predicted traffic speed
        """
        input_df = pd.DataFrame([input_features])
        features_scaled, _ = self.preprocess_data(input_df)
        prediction = self.model.predict(features_scaled)
        return prediction[0]
