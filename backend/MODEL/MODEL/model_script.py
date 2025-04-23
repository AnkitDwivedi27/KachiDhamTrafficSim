import os

# Define the base project directory
base_dir = 'traffic-simulation-project'

# Define the folder structure
folders = [
    'data',
    'models',
    'models/traffic_predictor.py',
    'models/route_optimizer.py',
    'simulation',
    'simulation/graph_creation.py',
    'simulation/traffic_simulation.py',
    'visualizations',
    'visualizations/traffic_map_visual.py',
    'visualizations/traffic_analysis.py',
    'utils',
    'utils/data_preprocessing.py',
    'main.py'
]

# Create directories and files
for folder in folders:
    # Check if it's a directory or a file path
    path = os.path.join(base_dir, folder)
    if '.' in folder:  # It's a file
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            pass  # Create the file (empty)
    else:  # It's a directory
        os.makedirs(path, exist_ok=True)

print(f"Project structure for {base_dir} has been created successfully.")
