import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

class TrafficAnalysis:
    def __init__(self, data_filepath: str):
        """
        Initializes the TrafficAnalysis class with the dataset.
        :param data_filepath: Path to the CSV dataset file
        """
        self.data = pd.read_csv(data_filepath)
    
    def plot_traffic_congestion(self):
        """
        Plots the distribution of traffic congestion levels over time.
        """
        plt.figure(figsize=(10, 6))
        congestion_counts = self.data['congestion_level'].value_counts().sort_index()
        plt.bar(congestion_counts.index, congestion_counts.values, color='skyblue')
        plt.xlabel('Congestion Level')
        plt.ylabel('Frequency')
        plt.title('Traffic Congestion Levels Distribution')
        plt.xticks(rotation=45)
        plt.show()
    
    def plot_vehicle_type_distribution(self):
        """
        Plots the distribution of vehicle types in the dataset.
        """
        plt.figure(figsize=(10, 6))
        vehicle_counts = self.data['vehicle_type'].value_counts().sort_index()
        sns.barplot(x=vehicle_counts.index, y=vehicle_counts.values, palette="viridis")
        plt.xlabel('Vehicle Type')
        plt.ylabel('Frequency')
        plt.title('Vehicle Type Distribution')
        plt.xticks(rotation=45)
        plt.show()

    def plot_traffic_over_time(self):
        """
        Plots traffic congestion levels over time.
        """
        plt.figure(figsize=(12, 6))
        self.data['timestamp'] = pd.to_datetime(self.data['timestamp'])
        self.data.set_index('timestamp', inplace=True)

        # Resampling to get congestion levels per hour
        congestion_hourly = self.data['congestion_level'].resample('H').mean()
        plt.plot(congestion_hourly, color='orange')
        plt.xlabel('Time')
        plt.ylabel('Average Congestion Level')
        plt.title('Traffic Congestion Levels Over Time')
        plt.xticks(rotation=45)
        plt.grid(True)
        plt.show()

    def plot_feature_correlation(self):
        """
        Plots the correlation heatmap of the dataset's features.
        """
        plt.figure(figsize=(10, 8))
        correlation_matrix = self.data.corr()
        sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt='.2f', linewidths=0.5)
        plt.title('Feature Correlation Matrix')
        plt.show()

    def analyze_prediction_accuracy(self, y_true, y_pred):
        """
        Analyzes the accuracy of traffic predictions.
        :param y_true: Actual traffic congestion levels
        :param y_pred: Predicted traffic congestion levels
        """
        from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

        mae = mean_absolute_error(y_true, y_pred)
        mse = mean_squared_error(y_true, y_pred)
        r2 = r2_score(y_true, y_pred)

        print(f"Prediction Accuracy Metrics:")
        print(f"Mean Absolute Error (MAE): {mae}")
        print(f"Mean Squared Error (MSE): {mse}")
        print(f"R^2 Score: {r2}")

    def visualize_predictions(self, y_true, y_pred):
        """
        Visualizes the predicted traffic congestion against actual congestion levels.
        :param y_true: Actual traffic congestion levels
        :param y_pred: Predicted traffic congestion levels
        """
        plt.figure(figsize=(10, 6))
        plt.plot(y_true, label='Actual Congestion Levels', color='blue')
        plt.plot(y_pred, label='Predicted Congestion Levels', color='red', linestyle='--')
        plt.xlabel('Time')
        plt.ylabel('Congestion Level')
        plt.title('Actual vs Predicted Traffic Congestion Levels')
        plt.legend()
        plt.show()


# Example usage
if __name__ == "__main__":
    # Initialize the TrafficAnalysis class with the path to your dataset
    traffic_analyzer = TrafficAnalysis(data_filepath="data/processed_traffic_data.csv")
    
    # Plot the distribution of traffic congestion levels
    traffic_analyzer.plot_traffic_congestion()

    # Plot the distribution of vehicle types
    traffic_analyzer.plot_vehicle_type_distribution()

    # Plot traffic congestion levels over time
    traffic_analyzer.plot_traffic_over_time()

    # Plot the feature correlation matrix
    traffic_analyzer.plot_feature_correlation()

    # Analyze the prediction accuracy (Assume you have true and predicted values for congestion levels)
    # Example:
    y_true = [0, 1, 2, 3, 2, 1]  # Replace with actual y_true data
    y_pred = [0, 1, 2, 3, 1, 2]  # Replace with predicted data
    traffic_analyzer.analyze_prediction_accuracy(y_true, y_pred)

    # Visualize predictions vs actual congestion levels
    traffic_analyzer.visualize_predictions(y_true, y_pred)
