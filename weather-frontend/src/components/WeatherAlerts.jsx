import React from "react";

const WeatherAlerts = ({ alerts, onDismiss, onDismissAll }) => {
  if (!alerts.length) return null;

  const getAlertColor = (severity) => {
    switch (severity) {
      case "critical": return "#ff4444";
      case "high": return "#ff6b6b";
      case "medium": return "#ffa502";
      case "low": return "#4b7bec";
      default: return "#ffa502";
    }
  };

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h3>⚠️ Weather Alerts & Warnings</h3>
        <button className="dismiss-all" onClick={onDismissAll}>
          Dismiss All
        </button>
      </div>
      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`alert-card alert-${alert.type}`}
            style={{ borderLeftColor: getAlertColor(alert.severity) }}
          >
            <div className="alert-icon">{alert.icon}</div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-message">{alert.message}</div>
              <div className="alert-time">{alert.time}</div>
            </div>
            <button className="alert-dismiss" onClick={() => onDismiss(index)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;