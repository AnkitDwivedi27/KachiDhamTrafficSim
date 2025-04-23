import networkx as nx
import pandas as pd
import matplotlib.pyplot as plt

class TrafficGraph:
    def __init__(self):
        """
        Initializes the TrafficGraph class to create a graph with intersections (nodes)
        and roads (edges).
        """
        self.graph = nx.DiGraph()  # Directed graph (edges have direction)

    def create_graph(self, road_data: pd.DataFrame):
        """
        Create a graph structure from the given road data.
        :param road_data: DataFrame with road information (start, end, distance, traffic_data)
        """
        for _, row in road_data.iterrows():
            start = row['start_node']
            end = row['end_node']
            distance = row['distance']
            traffic_data = row['traffic_data']

            # Add nodes for each intersection
            if not self.graph.has_node(start):
                self.graph.add_node(start, type='intersection')
            if not self.graph.has_node(end):
                self.graph.add_node(end, type='intersection')

            # Add edges representing roads between intersections (with distance and traffic data as attributes)
            self.graph.add_edge(start, end, distance=distance, traffic_data=traffic_data)
        
        print(f"Graph created with {len(self.graph.nodes)} nodes and {len(self.graph.edges)} edges.")

    def visualize_graph(self):
        """
        Visualize the graph using matplotlib.
        """
        plt.figure(figsize=(10, 8))
        pos = nx.spring_layout(self.graph, seed=42)  # Using spring layout for node placement
        nx.draw(self.graph, pos, with_labels=True, node_size=700, node_color='skyblue', font_size=10, font_weight='bold', edge_color='gray')
        edge_labels = nx.get_edge_attributes(self.graph, 'distance')
        nx.draw_networkx_edge_labels(self.graph, pos, edge_labels=edge_labels)
        plt.title("Traffic Network Graph")
        plt.show()

    def get_shortest_path(self, start_node, end_node):
        """
        Get the shortest path between two nodes using Dijkstra's algorithm.
        :param start_node: Starting node of the path
        :param end_node: Ending node of the path
        :return: List of nodes representing the shortest path
        """
        try:
            shortest_path = nx.dijkstra_path(self.graph, source=start_node, target=end_node, weight='distance')
            print(f"Shortest path from {start_node} to {end_node}: {shortest_path}")
            return shortest_path
        except nx.NetworkXNoPath:
            print(f"No path found between {start_node} and {end_node}.")
            return None

    def get_traffic_data(self, start_node, end_node):
        """
        Get the traffic data between two nodes (i.e., the traffic condition on a specific road).
        :param start_node: Starting node of the road
        :param end_node: Ending node of the road
        :return: Traffic data (e.g., congestion level, traffic volume)
        """
        if self.graph.has_edge(start_node, end_node):
            traffic_data = self.graph[start_node][end_node]['traffic_data']
            return traffic_data
        else:
            print(f"No edge exists between {start_node} and {end_node}.")
            return None
