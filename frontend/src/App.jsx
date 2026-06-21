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
import "./App.css";

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
      <div className="loading-screen">
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
      ? "status-critical"
      : telemetry.status === "WARNING"
      ? "status-warning"
      : "status-normal";

  const statusText =
    telemetry.status === "CRITICAL"
      ? "CRITICAL CONDITION DETECTED"
      : telemetry.status === "WARNING"
      ? "WARNING CONDITION DETECTED !!!"
      : "SYSTEM NORMAL";

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          {/* Animated Engine Turbine Icon */}
          <svg className="engine-turbine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 12v-6a4 4 0 0 1 4 4v2z" />
            <path d="M12 12v6a4 4 0 0 1-4-4v-2z" />
            <path d="M12 12H6a4 4 0 0 1 4-4h2z" />
            <path d="M12 12h6a4 4 0 0 1-4 4h-2z" />
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
          AeroGuard Edge
        </h1>
        <h3>
          {/* New Minimalist Hovering Aircraft Icon */}
          <svg className="flight-hover-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5l-8.2-1.8c-1.2-.3-2.4.3-2.8 1.5-.3.9.1 1.9.9 2.4l4.6 2.7-2.6 2.6L3 16.5l-1 1 3.5 2 2 3.5 1-1-.5-3.1 2.6-2.6 2.7 4.6c.5.8 1.5 1.2 2.4.9 1.2-.4 1.8-1.6 1.5-2.8z"></path>
          </svg>
          Flight {telemetry.flight_id}
        </h3>
      </header>

      {/* Status Banner */}
      <div className={`status-banner ${statusColor}`}>
        {statusText}
      </div>

      {/* Main Two-Column Layout */}
      <div className="main-grid">
        {/* Health Summary */}
        <div className="card">
          <h2>Aircraft Health Score: {healthScore}%</h2>
          <div className="list-details">
            <p><strong>Current Cycle:</strong> <span>{telemetry.current_cycle}</span></p>
            <p><strong>Risk Level:</strong> <span className={telemetry.status === "WARNING" ? "text-red" : ""}>{telemetry.status}</span></p>
            <p><strong>Predicted Failure:</strong> <span>{critical ? "Engine Valve" : "None"}</span></p>
            <p><strong>Remaining Useful Life:</strong> <span>{telemetry.predicted_rul} Cycles</span></p>
            <p className="timestamp">Last Updated: {telemetry.timestamp}</p>
          </div>
        </div>

        {/* Digital Twin Summary */}
        <div className="card">
          <h2>Digital Twin Subsystems</h2>
          <div className="list-details">
            <p><strong>Engine 1:</strong> <span className={critical ? "text-red" : "text-green"}>{critical ? "Critical" : "Healthy"}</span></p>
            <p><strong>Engine 2:</strong> <span className="text-green">Healthy</span></p>
            <p><strong>Hydraulic System:</strong> <span className="text-green">Healthy</span></p>
            <p>
              <strong>Cooling System:</strong> 
              <span className={telemetry.status === "WARNING" ? "text-red" : critical ? "text-red" : "text-green"}>
                {telemetry.status === "WARNING" ? "Warning !!!" : critical ? "Critical" : "Healthy"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Row */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <h3>Core Temperature</h3>
          <div className="metric-value">{telemetry.live_metrics.core_temperature.toFixed(1)}°C</div>
        </div>
        <div className="card metric-card">
          <h3>Bypass Pressure</h3>
          <div className="metric-value">{telemetry.live_metrics.bypass_pressure.toFixed(1)} psi</div>
        </div>
        <div className="card metric-card">
          <h3>Rotor Vibration</h3>
          <div className="metric-value">{telemetry.live_metrics.rotor_vibration.toFixed(1)} Hz</div>
        </div>
        <div className="card metric-card">
          <h3>Predicted RUL</h3>
          <div className="metric-value">{telemetry.predicted_rul} Cycles</div>
        </div>
      </div>

      {/* Critical Alert Override */}
      {critical && (
        <div className="critical-alert">
          <h2>CRITICAL ALERT</h2>
          <p>Engine Valve Degradation Detected. Predicted RUL: {telemetry.predicted_rul} Cycles.</p>
        </div>
      )}

      {/* Graph */}
      <div className="card">
        <h2>Engine Temperature Trend</h2>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            <XAxis dataKey="cycle" stroke="#475569" tick={{ fill: '#475569', fontSize: 14 }} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" tick={{ fill: '#475569', fontSize: 14 }} tickLine={false} axisLine={false} />
            <Tooltip 
               contentStyle={{ borderRadius: '8px', border: '1px solid #bfdbfe', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '16px' }} 
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 8, fill: "#2563eb", stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Reasoning Engine */}
      <div className="card">
        <h2>AI Reasoning Engine</h2>
        <div className="reasoning-grid">
          <span><strong>Cycle:</strong> {telemetry.current_cycle}</span>
          <span><strong>Temperature:</strong> {telemetry.live_metrics.core_temperature.toFixed(1)}</span>
          <span><strong>Vibration:</strong> {telemetry.live_metrics.rotor_vibration.toFixed(1)}</span>
        </div>
        <p className="reasoning-text">
          The edge-deployed AI model continuously monitors localized degradation patterns across multivariate sensor outputs to predict maintenance requirements proactively before catastrophic failure occurs.
        </p>
      </div>
    </div>
  );
}

export default App;