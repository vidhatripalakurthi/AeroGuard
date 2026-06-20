import pandas as pd

column_names = [
    'unit_number',
    'time_in_cycles',
    'op_setting_1',
    'op_setting_2',
    'op_setting_3',
    'sensor_1',
    'sensor_2',
    'sensor_3',
    'sensor_4',
    'sensor_5',
    'sensor_6',
    'sensor_7',
    'sensor_8',
    'sensor_9',
    'sensor_10',
    'sensor_11',
    'sensor_12',
    'sensor_13',
    'sensor_14',
    'sensor_15',
    'sensor_16',
    'sensor_17',
    'sensor_18',
    'sensor_19',
    'sensor_20',
    'sensor_21'
]

# Read dataset
data = pd.read_csv(
    "dataset/train_FD001.txt",
    sep=r"\s+",
    header=None,
    names=column_names
)

# Remove flat sensors
columns_to_drop = [
    'sensor_1',
    'sensor_5',
    'sensor_6',
    'sensor_10',
    'sensor_16',
    'sensor_18',
    'sensor_19'
]

data = data.drop(columns=columns_to_drop)

# Calculate RUL
max_cycles = data.groupby('unit_number')['time_in_cycles'].max()

data = data.merge(
    max_cycles.rename('max_cycles'),
    on='unit_number'
)

data['RUL'] = data['max_cycles'] - data['time_in_cycles']

# Remove helper column
data = data.drop(columns=['max_cycles'])

# Save processed data
data.to_csv(
    "dataset/processed_train_data.csv",
    index=False
)

print("Processed dataset saved successfully!")
print(data.head())