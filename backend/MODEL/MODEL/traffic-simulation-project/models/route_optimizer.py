import numpy as np
import pandas as pd
import networkx as nx
from sklearn.preprocessing import StandardScaler

class RouteOptimizer:
    def __init__(self, predicted_data: pd.DataFrame):
        """
        Initialize the RouteOptimizer with the predicted traffic data.
        :param predicted_data: Predicted traffic data with traffic speeds for each road segment.
        """
        self.predicted_data = predicted_data
        self.graph = self.create_graph()
        self.scaler = StandardScaler()

    def create_graph(self):
        """
        Create a graph of roads and intersections.
        Nodes represent intersections, and edges represent road segments.
        """
        G = nx.Graph()

        # Assuming the predicted data has columns: 'road_id', 'start_intersection', 'end_intersection', 'predicted_speed'
        for index, row in self.predicted_data.iterrows():
            start = row['start_intersection']
            end = row['end_intersection']
            speed = row['predicted_speed']
            road_id = row['road_id']

            # Add edges to the graph with the predicted speed as the weight
            G.add_edge(start, end, weight=1 / (speed + 1e-6))  # Avoid division by zero with a small epsilon

        return G

    def find_best_routes(self, start_node: str = 'A', end_node: str = 'B'):
        """
        Find the best routes from start_node to end_node using Dijkstra's algorithm.
        :param start_node: Starting intersection
        :param end_node: Ending intersection
        :return: List of best routes and their travel times
        """
        print(f"Calculating best routes from {start_node} to {end_node}...")
        
        # Use Dijkstra's algorithm to find the shortest path based on predicted speeds (travel time)
        shortest_path = nx.shortest_path(self.graph, source=start_node, target=end_node, weight='weight')
        
        # Calculate the total predicted travel time for the best path
        total_travel_time = sum(1 / (self.predicted_data.loc[
            (self.predicted_data['start_intersection'] == shortest_path[i]) & 
            (self.predicted_data['end_intersection'] == shortest_path[i + 1]), 'predicted_speed'].values[0] + 1e-6) 
                                for i in range(len(shortest_path) - 1))
        
        print(f"Best route from {start_node} to {end_node}: {shortest_path}")
        print(f"Total predicted travel time: {total_travel_time:.2f} minutes")
        
        return shortest_path, total_travel_time

    def find_multiple_routes(self, start_node: str = 'A', end_node: str = 'B', num_routes: int = 3):
        """
        Find multiple best routes using the K-shortest paths algorithm.
        :param start_node: Starting intersection
        :param end_node: Ending intersection
        :param num_routes: Number of routes to find
        :return: List of multiple best routes and their travel times
        """
        print(f"Calculating multiple best routes from {start_node} to {end_node}...")
        
        k_shortest_paths = list(nx.shortest_simple_paths(self.graph, source=start_node, target=end_node, weight='weight'))[:num_routes]
        
        routes_and_times = []
        for route in k_shortest_paths:
            total_travel_time = sum(1 / (self.predicted_data.loc[
                (self.predicted_data['start_intersection'] == route[i]) & 
                (self.predicted_data['end_intersection'] == route[i + 1]), 'predicted_speed'].values[0] + 1e-6) 
                                    for i in range(len(route) - 1))
            routes_and_times.append((route, total_travel_time))
        
        for i, (route, time) in enumerate(routes_and_times):
            print(f"Route {i+1}: {route} | Total travel time: {time:.2f} minutes")
        
        return routes_and_times
