import joblib
import pandas as pd

# Load model
model = joblib.load("models/aeroguard_model.pkl")

# IMPORTANT: Same order used during training
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
    input_df = pd.DataFrame([sensor_data])

    # Ensure correct feature order
    input_df = input_df[feature_columns]

    predicted_rul = model.predict(input_df)[0]

    return int(predicted_rul)

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