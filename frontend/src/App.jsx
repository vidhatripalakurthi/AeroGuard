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
  const critical = true;

  const data = [
    { cycle: 1, temp: 72 },
    { cycle: 2, temp: 73 },
    { cycle: 3, temp: 74 },
    { cycle: 4, temp: 76 },
    { cycle: 5, temp: 80 },
    { cycle: 6, temp: 85 },
  ];

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
      {/* Header */}
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
        Flight AI-402 | London → Delhi
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
        <h2>Aircraft Health Score: 67%</h2>
        <p>Risk Level: 🔴 HIGH</p>
        <p>Predicted Failure: Engine Valve</p>
        <p>Remaining Useful Life: 18 Cycles</p>
      </div>

      {/* Status */}
      <div
        style={{
          background: critical ? "#dc2626" : "#16a34a",
          padding: "15px",
          borderRadius: "12px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
          marginBottom: "20px",
        }}
      >
        {critical
          ? "🚨 CRITICAL CONDITION DETECTED"
          : "🟢 SYSTEM NORMAL"}
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
          <h3>Temperature</h3>
          <h2>85°C</h2>
        </div>

        <div style={cardStyle}>
          <h3>Pressure</h3>
          <h2>101 PSI</h2>
        </div>

        <div style={cardStyle}>
          <h3>Vibration</h3>
          <h2>18</h2>
        </div>

        <div style={cardStyle}>
          <h3>Predicted RUL</h3>
          <h2>18 Cycles</h2>
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
          Predicted Failure Within 18 Cycles
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

        <p>Engine 1 : ✅ Healthy</p>
        <p>Engine 2 : 🚨 Critical</p>
        <p>Hydraulic System : ✅ Healthy</p>
        <p>Cooling System : ⚠️ Warning</p>
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
          <LineChart data={data}>
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

        <p>Temperature increased by 18%</p>

        <p>Vibration increased by 23%</p>

        <p>
          Based on historical degradation patterns, the engine
          valve shows abnormal wear and has a high probability
          of failure.
        </p>

        <p>
          Confidence Score: 92%
        </p>
      </div>

      {/* Recommendation */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2>🔧 Maintenance Recommendation</h2>

        <p>Replace Engine Valve Assembly immediately.</p>

        <p>
          Notify Delhi maintenance team before landing.
        </p>

        <p>
          Keep replacement component ready at Gate A12.
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