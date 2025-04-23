import pandas as pd
import folium
from folium.plugins import HeatMap

class TrafficMapVisualizer:
    def __init__(self, data_filepath: str):
        """
        Initializes the TrafficMapVisualizer class with the dataset.
        :param data_filepath: Path to the CSV dataset file
        """
        self.data = pd.read_csv(data_filepath)
    
    def create_traffic_map(self, location=[28.6139, 77.2090], zoom_start=12):
        """
        Creates an interactive map to visualize traffic data.
        :param location: Initial map center as [latitude, longitude]
        :param zoom_start: Initial zoom level for the map
        :return: folium map object
        """
        traffic_map = folium.Map(location=location, zoom_start=zoom_start)
        
        # Add a heatmap for traffic congestion
        congestion_data = self.data[['latitude', 'longitude', 'congestion_level']]
        congestion_data = congestion_data.dropna()  # Remove rows with missing values
        
        heat_data = [[row['latitude'], row['longitude'], row['congestion_level']] for index, row in congestion_data.iterrows()]
        HeatMap(heat_data).add_to(traffic_map)
        
        return traffic_map
    
    def add_vehicle_markers(self):
        """
        Adds vehicle type markers to the map for visualization.
        """
        vehicle_data = self.data[['latitude', 'longitude', 'vehicle_type']]
        vehicle_data = vehicle_data.dropna()  # Remove rows with missing values

        # Define colors for different vehicle types
        vehicle_colors = {
            'Motorbike': 'blue',
            'Car': 'green',
            'Bus': 'red',
            'Truck': 'purple',
            'Ambulance': 'orange'
        }

        traffic_map = folium.Map(location=[28.6139, 77.2090], zoom_start=12)

        for index, row in vehicle_data.iterrows():
            color = vehicle_colors.get(row['vehicle_type'], 'black')
            folium.CircleMarker(
                location=[row['latitude'], row['longitude']],
                radius=5,
                color=color,
                fill=True,
                fill_opacity=0.6,
                popup=f"Vehicle Type: {row['vehicle_type']}"
            ).add_to(traffic_map)
        
        return traffic_map

    def visualize_traffic_on_map(self):
        """
        Visualizes the traffic congestion on the map with both heatmap and vehicle markers.
        """
        # Create the base map
        traffic_map = self.create_traffic_map()

        # Add vehicle markers
        traffic_map = self.add_vehicle_markers()
        
        return traffic_map

    def save_map(self, traffic_map, filename="traffic_map.html"):
        """
        Saves the generated traffic map to an HTML file.
        :param traffic_map: Folium map object
        :param filename: Output file name
        """
        traffic_map.save(filename)
        print(f"Map saved as {filename}")

# Example usage
if __name__ == "__main__":
    # Initialize the TrafficMapVisualizer with the path to your dataset
    map_visualizer = TrafficMapVisualizer(data_filepath="data/processed_traffic_data.csv")

    # Visualize traffic congestion and vehicle types on the map
    traffic_map = map_visualizer.visualize_traffic_on_map()

    # Save the map as an HTML file
    map_visualizer.save_map(traffic_map, filename="traffic_map.html")
