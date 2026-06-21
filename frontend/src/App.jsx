import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/telemetry");
        const data = await res.json();

        setTelemetry(data);

        setChartData((prev) => {
          const updated = [
            ...prev,
            {
              cycle: data.current_cycle,
              temp: data.live_metrics.core_temperature,
            },
          ];

          return updated.slice(-15);
        });
      } catch (err) {
        console.log("Error fetching telemetry:", err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!telemetry) {
    return (
      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Loading AeroGuard Dashboard...
      </div>
    );
  }

  const critical = telemetry.status === "CRITICAL";

  const healthScore = Math.min(
    100,
    Math.round((telemetry.predicted_rul / 150) * 100)
  );

  const statusColor =
    telemetry.status === "CRITICAL"
      ? "#dc2626"
      : telemetry.status === "WARNING"
      ? "#f59e0b"
      : "#16a34a";

  const statusText =
    telemetry.status === "CRITICAL"
      ? "🚨 CRITICAL CONDITION DETECTED"
      : telemetry.status === "WARNING"
      ? "⚠️ WARNING CONDITION DETECTED"
      : "🟢 SYSTEM NORMAL";

  const cardStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    minWidth: "180px",
    flex: 1,
  };

  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "25px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#38bdf8" }}>
        ✈️ AeroGuard Edge
      </h1>

      <h3
        style={{
          textAlign: "center",
          color: "#cbd5e1",
          marginBottom: "25px",
        }}
      >
        Flight {telemetry.flight_id}
      </h3>

      {/* Health Summary */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2>Aircraft Health Score: {healthScore}%</h2>

        <p>Current Cycle: {telemetry.current_cycle}</p>

        <p>
          Risk Level:
          {telemetry.status === "CRITICAL"
            ? " 🔴 HIGH"
            : telemetry.status === "WARNING"
            ? " 🟡 MEDIUM"
            : " 🟢 LOW"}
        </p>

        <p>
          Predicted Failure:
          {critical ? " Engine Valve" : " None"}
        </p>

        <p>
          Remaining Useful Life:
          {telemetry.predicted_rul} Cycles
        </p>

        <p>
          Confidence Score:
          {(telemetry.confidence_score * 100).toFixed(0)}%
        </p>

        <p>Last Updated: {telemetry.timestamp}</p>
      </div>

      {/* Status */}
      <div
        style={{
          background: statusColor,
          padding: "15px",
          borderRadius: "12px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
          marginBottom: "20px",
        }}
      >
        {statusText}
      </div>

      {/* Telemetry Cards */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div style={cardStyle}>
          <h3>Core Temperature</h3>
          <h2>
            {telemetry.live_metrics.core_temperature.toFixed(1)}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Bypass Pressure</h3>
          <h2>
            {telemetry.live_metrics.bypass_pressure.toFixed(1)}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Rotor Vibration</h3>
          <h2>
            {telemetry.live_metrics.rotor_vibration.toFixed(1)}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Predicted RUL</h3>
          <h2>{telemetry.predicted_rul} Cycles</h2>
        </div>
      </div>

      {/* Critical Alert */}
      {critical && (
        <div
          style={{
            background: "#ef4444",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "25px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          🚨 CRITICAL ALERT
          <br />
          Engine Valve Degradation Detected
          <br />
          Predicted RUL: {telemetry.predicted_rul} Cycles
        </div>
      )}

      {/* Digital Twin */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2>✈️ Digital Twin Aircraft View</h2>

        <p>
          Engine 1 :
          {critical ? " 🚨 Critical" : " ✅ Healthy"}
        </p>

        <p>Engine 2 : ✅ Healthy</p>

        <p>Hydraulic System : ✅ Healthy</p>

        <p>
          Cooling System :
          {telemetry.status === "WARNING"
            ? " ⚠️ Warning"
            : critical
            ? " 🚨 Critical"
            : " ✅ Healthy"}
        </p>
      </div>

      {/* Graph */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2>📈 Engine Temperature Trend</h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#38bdf8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Reasoning */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2>🤖 AI Reasoning Engine</h2>

        <p>Current Cycle: {telemetry.current_cycle}</p>

        <p>
          Temperature:
          {telemetry.live_metrics.core_temperature.toFixed(1)}
        </p>

        <p>
          Vibration:
          {telemetry.live_metrics.rotor_vibration.toFixed(1)}
        </p>

        <p>
          The AI model continuously monitors engine
          degradation patterns and predicts maintenance
          requirements before failure occurs.
        </p>

        <p>
          Confidence Score:
          {(telemetry.confidence_score * 100).toFixed(0)}%
        </p>
      </div>

      {/* Maintenance */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2>🔧 Maintenance Recommendation</h2>

        <p>
          Prepare maintenance crew before aircraft arrival.
        </p>

        <p>
          Monitor engine condition continuously.
        </p>

        <p>
          Schedule inspection if RUL falls below 30.
        </p>
      </div>

      {/* Business Impact */}
      <div
        style={{
          background: "#14532d",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h2>💰 Business Impact</h2>

        <p>Aircraft Grounding Avoided: ✅</p>

        <p>Turnaround Delay Avoided: 4 Hours</p>

        <p>Estimated Savings: ₹2.5 Lakhs</p>

        <p>Maintenance Prepared Before Landing: ✅</p>
      </div>
    </div>
  );
}

export default App;