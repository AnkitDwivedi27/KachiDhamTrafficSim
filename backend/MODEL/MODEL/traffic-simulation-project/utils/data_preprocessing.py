# utils/data_preprocessing.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

class DataPreprocessing:
    def __init__(self):
        """
        Initializes the DataPreprocessing class without any dataset.
        The data will be loaded later using the load_data method.
        """
        self.data = None
        self.cleaned_data = None

    def load_data(self, filepath: str):
        """
        Loads the dataset from the given filepath.
        :param filepath: Path to the CSV dataset file
        """
        self.data = pd.read_csv(filepath)
        print(f"Data loaded from {filepath}")

    def clean_data(self):
        """
        Cleans the dataset by handling missing values, duplicates, and invalid data.
        """
        if self.data is None:
            raise ValueError("Data not loaded. Please load the data using load_data() first.")

        # Drop duplicate rows if they exist
        self.data.drop_duplicates(inplace=True)
        
        # Handle missing values by filling with median or mode based on the column type
        self.data.fillna(self.data.median(), inplace=True)  # For numerical columns
        for col in self.data.select_dtypes(include=['object']).columns:  # For categorical columns
            self.data[col].fillna(self.data[col].mode()[0], inplace=True)
        
        print("Data cleaned successfully!")

    def encode_features(self):
        """
        Encodes categorical variables (like vehicle type and congestion level) into numerical format.
        """
        if self.data is None:
            raise ValueError("Data not loaded. Please load the data using load_data() first.")

        label_encoder = LabelEncoder()

        # Encoding 'vehicle_type' and 'congestion_level'
        self.data['vehicle_type'] = label_encoder.fit_transform(self.data['vehicle_type'])
        self.data['congestion_level'] = label_encoder.fit_transform(self.data['congestion_level'])
        
        print("Features encoded successfully!")

    def scale_features(self):
        """
        Scales numerical features like distance to a common range using StandardScaler.
        """
        if self.data is None:
            raise ValueError("Data not loaded. Please load the data using load_data() first.")

        scaler = StandardScaler()

        # Scaling the 'distance' column
        self.data['distance'] = scaler.fit_transform(self.data[['distance']])

        print("Features scaled successfully!")

    def split_data(self, test_size: float = 0.2):
        """
        Splits the dataset into training and testing sets.
        :param test_size: Proportion of the dataset to be used as the test set (default is 20%)
        :return: X_train, X_test, y_train, y_test
        """
        if self.data is None:
            raise ValueError("Data not loaded. Please load the data using load_data() first.")

        # Assuming the target variable is 'congestion_level'
        X = self.data.drop(columns=['congestion_level'])
        y = self.data['congestion_level']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
        print("Data split into training and testing sets!")
        
        return X_train, X_test, y_train, y_test

    def save_processed_data(self, output_filepath: str):
        """
        Saves the processed dataset to a new CSV file.
        :param output_filepath: Path where the processed data should be saved
        """
        if self.data is None:
            raise ValueError("Data not loaded. Please load the data using load_data() first.")
        
        self.data.to_csv(output_filepath, index=False)
        print(f"Processed data saved to {output_filepath}")


# Example usage
if __name__ == "__main__":
    # Initialize the DataPreprocessing class
    data_preprocessor = DataPreprocessing()
    
    # Load the data
    data_preprocessor.load_data("data/traffic_data.csv")
    
    # Clean the data
    data_preprocessor.clean_data()
    
    # Encode categorical features
    data_preprocessor.encode_features()
    
    # Scale numerical features
    data_preprocessor.scale_features()
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = data_preprocessor.split_data(test_size=0.2)
    
    # Save the processed data
    data_preprocessor.save_processed_data("data/processed_traffic_data.csv")
