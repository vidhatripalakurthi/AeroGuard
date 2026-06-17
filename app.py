from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

current_state = {
    "flight_id": "AI-402",
    "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    "current_cycle": 142,
    "predicted_rul": 45,
    "status": "SAFE",
    "failing_part": "None",
    "confidence_score": 0.95,
    "live_metrics": {
        "core_temperature": 602.5,
        "rotor_vibration": 12.4,
        "bypass_pressure": 390.1
    }
}


@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    current_state["timestamp"] = datetime.datetime.utcnow().isoformat() + "Z"
    return jsonify(current_state)


@app.route('/api/ingest', methods=['POST'])
def ingest_telemetry():
    global current_state

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    current_state["flight_id"] = data.get("flight_id", "AI-402")
    current_state["current_cycle"] = data.get("time_in_cycles", 0)
    current_state["timestamp"] = datetime.datetime.utcnow().isoformat() + "Z"

    sensors = data.get("sensors", {})

    current_state["live_metrics"]["core_temperature"] = sensors.get("sensor_3", 0.0)
    current_state["live_metrics"]["rotor_vibration"] = sensors.get("sensor_4", 0.0)
    current_state["live_metrics"]["bypass_pressure"] = sensors.get("sensor_7", 0.0)

    # Temporary RUL simulation until Member 1 gives model.pkl
    current_state["predicted_rul"] = max(0, 200 - current_state["current_cycle"])

    if current_state["predicted_rul"] > 50:
        current_state["status"] = "SAFE"
    elif current_state["predicted_rul"] > 30:
        current_state["status"] = "WARNING"
    else:
        current_state["status"] = "CRITICAL"

    print(
        f"[Edge Node] Cycle={current_state['current_cycle']} "
        f"RUL={current_state['predicted_rul']} "
        f"Status={current_state['status']}"
    )

    return jsonify({
        "status": "success",
        "message": "Telemetry ingested"
    }), 200


if __name__ == '__main__':
    print("[AeroGuard Edge] Starting Local Server on port 5000...")
    app.run(debug=True, port=5000)