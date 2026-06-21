import time
import requests

# Flask backend URL
FLASK_URL = "http://localhost:5000/api/ingest"

# Dataset file
DATA_FILE = "data/test_FD001.txt"


def start_flight_simulation():
    print(f"[AeroGuard Streamer] Starting telemetry stream from {DATA_FILE}...")

    try:
        with open(DATA_FILE, "r") as file:

            for line in file:
                values = line.strip().split()

                # Skip invalid rows
                if len(values) < 26:
                    continue

                payload = {
                    "flight_id": "AI-402",
                    "unit_number": int(values[0]),
                    "time_in_cycles": int(values[1]),

                    # Operating settings
                    "op_setting_1": float(values[2]),
                    "op_setting_2": float(values[3]),
                    "op_setting_3": float(values[4]),

                    # Sensors required by model
                    "sensor_2": float(values[6]),
                    "sensor_3": float(values[7]),
                    "sensor_4": float(values[8]),
                    "sensor_7": float(values[11]),
                    "sensor_8": float(values[12]),
                    "sensor_9": float(values[13]),
                    "sensor_11": float(values[15]),
                    "sensor_12": float(values[16]),
                    "sensor_13": float(values[17]),
                    "sensor_14": float(values[18]),
                    "sensor_15": float(values[19]),
                    "sensor_17": float(values[21]),
                    "sensor_20": float(values[24]),
                    "sensor_21": float(values[25])
                }

                try:
                    response = requests.post(FLASK_URL, json=payload)

                    print(
                        f"[Streamer] Unit {payload['unit_number']} | "
                        f"Cycle {payload['time_in_cycles']} | "
                        f"Status {response.status_code}"
                    )

                    try:
                        print(response.json())
                    except:
                        pass

                except requests.exceptions.ConnectionError:
                    print(
                        "[Streamer] ERROR: Cannot connect to Flask server. "
                        "Make sure app.py is running."
                    )

                # Simulate live telemetry
                time.sleep(1)

    except FileNotFoundError:
        print(
            f"[Streamer] ERROR: Could not find {DATA_FILE}. "
            "Ensure test_FD001.txt is inside the data folder."
        )


if __name__ == "__main__":
    start_flight_simulation()