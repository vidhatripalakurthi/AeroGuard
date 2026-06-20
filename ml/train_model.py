import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import root_mean_squared_error
import joblib

# Load processed dataset
data = pd.read_csv("dataset/processed_train_data.csv")

# Features used by the model
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

# Input and target
X = data[feature_columns]
y = data['RUL']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestRegressor(
    n_estimators=50,
    max_depth=15,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# RMSE
rmse = root_mean_squared_error(y_test, y_pred)

print(f"RMSE: {rmse:.2f}")

# Save model
joblib.dump(model, "models/aeroguard_model.pkl")

print("Model saved successfully!")