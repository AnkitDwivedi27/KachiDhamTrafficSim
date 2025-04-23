import random
import time
import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd

from simulation.graph_creation import TrafficGraph


class TrafficSimulation:
    def __init__(self, graph: TrafficGraph):
        """
        Initializes the traffic simulation with a given traffic graph.
        :param graph: TrafficGraph object representing the road network.
        """
        self.graph = graph

    def simulate_traffic_flow(self, num_vehicles: int, vehicle_type: str, start_node: str, end_node: str, time_of_day: str):
        """
        Simulate traffic flow from start_node to end_node.
        The simulation considers the number of vehicles, vehicle type, and time of day.
        :param num_vehicles: Number of vehicles in the simulation
        :param vehicle_type: Type of vehicle (motorbike, car, bus, truck, ambulance)
        :param start_node: Starting node of the vehicle
        :param end_node: Ending node of the vehicle
        :param time_of_day: Time of day (morning, afternoon, evening, night)
        :return: Traffic flow status
        """
        # Get the shortest path and the traffic data between start and end nodes
        shortest_path = self.graph.get_shortest_path(start_node, end_node)

        if shortest_path is None:
            return f"No path exists from {start_node} to {end_node}."

        # Simulate traffic based on vehicle type and time of day
        congestion_level = self._get_congestion_level(vehicle_type, time_of_day)
        print(f"Simulating traffic flow from {start_node} to {end_node} for {num_vehicles} {vehicle_type}s.")
        print(f"Estimated congestion level: {congestion_level}.")

        # Simulate the traffic flow for each vehicle
        for i in range(num_vehicles):
            self._simulate_vehicle_movement(shortest_path, vehicle_type, congestion_level)

        return f"Traffic flow simulation completed from {start_node} to {end_node}."

    def _get_congestion_level(self, vehicle_type: str, time_of_day: str):
        """
        Calculate the congestion level based on vehicle type and time of day.
        :param vehicle_type: Type of vehicle (motorbike, car, bus, truck, ambulance)
        :param time_of_day: Time of day (morning, afternoon, evening, night)
        :return: Congestion level (light, moderate, heavy)
        """
        # Define base congestion levels
        base_congestion = {'light': 0.1, 'moderate': 0.5, 'heavy': 0.9}

        # Modify congestion based on vehicle type and time of day
        if vehicle_type == 'ambulance':
            return 'light'  # Ambulances typically bypass traffic and are considered light congestion
        if time_of_day in ['morning', 'evening']:
            return 'heavy'  # Morning and evening are peak times

        # For other vehicles, determine congestion based on a random factor
        congestion_factor = random.uniform(0, 1)

        if congestion_factor < base_congestion['light']:
            return 'light'
        elif congestion_factor < base_congestion['moderate']:
            return 'moderate'
        else:
            return 'heavy'

    def _simulate_vehicle_movement(self, path: list, vehicle_type: str, congestion_level: str):
        """
        Simulate the movement of a single vehicle along the path.
        :param path: List of nodes representing the path
        :param vehicle_type: Type of vehicle
        :param congestion_level: The congestion level on the road
        """
        print(f"Vehicle type: {vehicle_type}, Congestion: {congestion_level}")
        for node in path:
            print(f"Vehicle is passing through node {node}. Congestion: {congestion_level}")
            time.sleep(1)  # Simulating time taken to travel through a road segment (1 second per road)

    def visualize_traffic_simulation(self):
        """
        Visualize the traffic simulation results using matplotlib.
        Display congestion levels on the roads.
        """
        plt.figure(figsize=(10, 8))
        pos = nx.spring_layout(self.graph.graph, seed=42)
        nx.draw(self.graph.graph, pos, with_labels=True, node_size=700, node_color='skyblue', font_size=10, font_weight='bold', edge_color='gray')

        # Display traffic congestion levels on roads
        edge_labels = nx.get_edge_attributes(self.graph.graph, 'traffic_data')
        nx.draw_networkx_edge_labels(self.graph.graph, pos, edge_labels=edge_labels)
        plt.title("Traffic Flow Simulation")
        plt.show()


# Example usage of the TrafficSimulation class

# Load the traffic data and create the graph
road_data = pd.DataFrame({
    'start_node': ['A', 'B', 'C', 'A', 'C'],
    'end_node': ['B', 'C', 'D', 'C', 'A'],
    'distance': [5, 3, 4, 2, 6],
    'traffic_data': ['light', 'heavy', 'moderate', 'light', 'heavy']
})

# Create the traffic graph
traffic_graph = TrafficGraph()
traffic_graph.create_graph(road_data)

# Create a traffic simulation object
traffic_sim = TrafficSimulation(traffic_graph)

# Simulate traffic flow for 10 cars from node A to node D during the morning
simulation_result = traffic_sim.simulate_traffic_flow(10, 'car', 'A', 'D', 'morning')
print(simulation_result)

# Visualize the simulation
traffic_sim.visualize_traffic_simulation()
