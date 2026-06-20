from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

from ml.predict_rul import predict_rul

app = Flask(__name__)
CORS(app)

# Global state
current_state = {
    "flight_id": "AI-402",
    "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    "current_cycle": 0,
    "predicted_rul": 0,
    "status": "SAFE",
    "failing_part": "None",
    "confidence_score": 0.95,
    "live_metrics": {
        "core_temperature": 0.0,
        "rotor_vibration": 0.0,
        "bypass_pressure": 0.0
    }
}


@app.route('/')
def home():
    return "AeroGuard Edge Node Running!"


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

    # Live metrics for dashboard
    current_state["live_metrics"]["core_temperature"] = data.get("sensor_3", 0.0)
    current_state["live_metrics"]["rotor_vibration"] = data.get("sensor_4", 0.0)
    current_state["live_metrics"]["bypass_pressure"] = data.get("sensor_7", 0.0)

    try:
        sensor_data = {
            "op_setting_1": data["op_setting_1"],
            "op_setting_2": data["op_setting_2"],
            "op_setting_3": data["op_setting_3"],

            "sensor_2": data["sensor_2"],
            "sensor_3": data["sensor_3"],
            "sensor_4": data["sensor_4"],
            "sensor_7": data["sensor_7"],
            "sensor_8": data["sensor_8"],
            "sensor_9": data["sensor_9"],
            "sensor_11": data["sensor_11"],
            "sensor_12": data["sensor_12"],
            "sensor_13": data["sensor_13"],
            "sensor_14": data["sensor_14"],
            "sensor_15": data["sensor_15"],
            "sensor_17": data["sensor_17"],
            "sensor_20": data["sensor_20"],
            "sensor_21": data["sensor_21"]
        }

        current_state["predicted_rul"] = predict_rul(sensor_data)

    except Exception as e:
        print("[ML ERROR]", e)
        current_state["predicted_rul"] = -1

    # Status logic
    if current_state["predicted_rul"] >=80:
        current_state["status"] = "SAFE"

    elif current_state["predicted_rul"] >= 30:
        current_state["status"] = "WARNING"

    else:
        current_state["status"] = "CRITICAL"

    # Console logs
    if current_state["status"] == "SAFE":
        print(
            f"[AeroGuard Edge Node] "
            f"Cycle={current_state['current_cycle']} | "
            f"RUL={current_state['predicted_rul']} | "
            f"STATUS=SAFE"
        )

    elif current_state["status"] == "WARNING":
        print(
            f"[AeroGuard Edge Node] "
            f"Cycle={current_state['current_cycle']} | "
            f"RUL={current_state['predicted_rul']} | "
            f"STATUS=WARNING"
        )

    else:
        print("\n=================================================")
        print("          AEROGUARD CRITICAL ALERT")
        print("=================================================")
        print(f"Flight ID       : {current_state['flight_id']}")
        print(f"Cycle           : {current_state['current_cycle']}")
        print(f"Predicted RUL   : {current_state['predicted_rul']}")
        print("STATUS          : CRITICAL")
        print("INITIATING ACARS ALERT PROTOCOL")
        print("DISPATCH SPARE PARTS TO GATE")
        print("=================================================\n")

    return jsonify({
        "status": "success",
        "predicted_rul": current_state["predicted_rul"],
        "health_status": current_state["status"]
    }), 200


if __name__ == '__main__':
    print("\n========================================")
    print("   AeroGuard Edge Node Starting...")
    print("   Server running on localhost:5000")
    print("========================================\n")

    app.run(debug=True, port=5000)