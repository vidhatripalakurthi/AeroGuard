import os
import joblib
import pandas as pd

# Get absolute path of current file
BASE_DIR = os.path.dirname(__file__)

# Path to trained model
MODEL_PATH = os.path.join(BASE_DIR, "models", "aeroguard_model.pkl")

# Load model
model = joblib.load(MODEL_PATH)

# IMPORTANT: Must match training order exactly
feature_columns = [
    'op_setting_1',
    'op_setting_2',
    'op_setting_3',
    'sensor_2',
    'sensor_3',
    'sensor_4',
    'sensor_7',
    'sensor_8',
    'sensor_9',
    'sensor_11',
    'sensor_12',
    'sensor_13',
    'sensor_14',
    'sensor_15',
    'sensor_17',
    'sensor_20',
    'sensor_21'
]


def predict_rul(sensor_data):
    """
    Predict Remaining Useful Life (RUL)
    sensor_data should contain all 17 features.
    """

    input_df = pd.DataFrame([sensor_data])

    # Ensure exact feature order
    input_df = input_df[feature_columns]

    predicted_rul = model.predict(input_df)[0]

    return int(predicted_rul)


# Run sample only when file is executed directly
if __name__ == "__main__":

    sample_input = {
        'op_setting_1': -0.0007,
        'op_setting_2': -0.0004,
        'op_setting_3': 100,
        'sensor_2': 641.82,
        'sensor_3': 1589.70,
        'sensor_4': 1400.60,
        'sensor_7': 554.36,
        'sensor_8': 2388.06,
        'sensor_9': 9046.19,
        'sensor_11': 47.47,
        'sensor_12': 521.66,
        'sensor_13': 2388.02,
        'sensor_14': 8138.62,
        'sensor_15': 8.4195,
        'sensor_17': 392,
        'sensor_20': 39.06,
        'sensor_21': 23.4190
    }

    print("Predicted RUL:", predict_rul(sample_input))