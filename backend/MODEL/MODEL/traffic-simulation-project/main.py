"""
Entry‑point: run a full simulation → predict congestion → suggest best route → show plots.
"""
from utils.data_preprocessing import DataPreprocessing
from simulation.traffic_simulation import run_simulation
from models.traffic_predictor import TrafficPredictor
from models.route_optimizer import RouteOptimizer
from visualizations.traffic_analysis import plot_kpis

DATA_PATH = "data/traffic_data.csv"

def main():
    # 1. Initialize DataPreprocessing and load data
    data_preprocessor = DataPreprocessing(filepath=DATA_PATH)
    data_preprocessor.load_data()  # Load the dataset

    # 2. Clean, encode, and preprocess data
    data_preprocessor.clean_data()
    data_preprocessor.encode_features()
    data_preprocessor.scale_features()

    # 3. Microsimulation (returns df_sim with per-road metrics)
    df_sim = run_simulation(data_preprocessor.data)

    # 4. ML traffic predictor
    predictor = TrafficPredictor()
    predictor.fit(data_preprocessor.data)
    df_pred = predictor.predict(df_sim)

    # 5. Route optimization
    optimizer = RouteOptimizer(df_pred)
    best_paths = optimizer.find_best_routes()

    # 6. Visualize the summary
    plot_kpis(df_sim, df_pred, best_paths)

    print("✅ pipeline complete")

if __name__ == "__main__":
    main()

