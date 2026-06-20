import joblib
import pandas as pd

# Load trained model
model = joblib.load("models/aeroguard_model.pkl")

# Feature names (IMPORTANT: same order as training)
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

# Create dataframe of feature importances
importance_df = pd.DataFrame({
    "Feature": feature_columns,
    "Importance": model.feature_importances_
})

# Sort descending
importance_df = importance_df.sort_values(
    by="Importance",
    ascending=False
)

print("\nTop Important Features:\n")
print(importance_df)