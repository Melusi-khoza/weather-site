import React from "react";

const ForecastSection = ({ forecast, weatherAlerts }) => {
  return (
    <div className="right-column">
      {forecast?.hourly?.length > 0 && (
        <>
          <h3>Hourly Forecast</h3>
          <div className="hourly-container">
            {forecast.hourly.map((f, i) => {
              const hasAlert = weatherAlerts.some((a) => a.time === f.time);
              return (
                <div key={i} className={`hourly-card ${hasAlert ? "has-alert" : ""}`}>
                  <p className="time">{f.time}</p>
                  <img src={`https://openweathermap.org/img/wn/${f.icon}.png`} alt="forecast" />
                  <p className="temp">{Math.round(f.temp)}°C</p>
                  {f.wind_speed && <p className="wind">{f.wind_speed} km/h</p>}
                  {hasAlert && <span className="alert-indicator">⚠️</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {forecast?.daily?.length > 0 && (
        <>
          <h3>Weekly Forecast</h3>
          <div className="weekly-container">
            {forecast.daily.map((f, i) => {
              const desc = f.description?.toLowerCase() || "";
              const hasSevereWeather = desc.includes("thunder") ||
                desc.includes("heavy rain") || desc.includes("storm") || desc.includes("extreme");
              return (
                <div key={i} className={`hourly-card ${hasSevereWeather ? "severe-weather" : ""}`}>
                  <p className="date">{f.date}</p>
                  <img src={`https://openweathermap.org/img/wn/${f.icon}.png`} alt="forecast" />
                  <p className="temp">{Math.round(f.temp)}°C</p>
                  <p className="description-small">{f.description}</p>
                  {hasSevereWeather && <span className="severe-indicator">⚠️</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ForecastSection;