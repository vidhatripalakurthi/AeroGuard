import time
import requests

# The URL of your Flask server
FLASK_URL = "http://localhost:5000/api/ingest"
DATA_FILE = "data/test_FD001.txt"

def start_flight_simulation():
    print(f"[AeroGuard Streamer] Initiating simulated flight telemetry from {DATA_FILE}...")
    
    try:
        with open(DATA_FILE, 'r') as file:
            for line in file:
                # Clean up the line and split by spaces
                values = line.strip().split()
                if len(values)<26:
                    continue
                # Format exactly to the API Contract we agreed upon
                
                payload = {
                    "flight_id": "AI-402",
                    "unit_number": int(values[0]),
                    "time_in_cycles": int(values[1]),
                    "op_setting_1": float(values[2]),
                    "op_setting_2": float(values[3]),
                    "op_setting_3": float(values[4]),
                    "sensors": {
                        "sensor_2": float(values[6]),
                        "sensor_3": float(values[7]),
                        "sensor_4": float(values[8]),
                        "sensor_7": float(values[11]),
                        "sensor_11": float(values[15]),
                        "sensor_15": float(values[19])
                    }
                }
                
                try:
                    # Send telemetry to the Edge Node
                    response = requests.post(FLASK_URL, json=payload)
                    print(f"[Streamer] Sent Cycle {payload['time_in_cycles']} -> Status: {response.status_code}")
                except requests.exceptions.ConnectionError:
                    print("[Streamer] ERROR: Cannot connect to Flask. Is app.py running?")
                
                # Pause for 1 second to simulate live flight
                time.sleep(1)
                
    except FileNotFoundError:
        print(f"ERROR: Could not find {DATA_FILE}. Make sure the dataset is in the 'data' folder.")

if __name__ == "__main__":
    start_flight_simulation()