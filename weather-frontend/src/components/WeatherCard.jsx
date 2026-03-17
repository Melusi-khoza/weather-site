import React, { useState } from "react";

const WeatherCard = ({ weather, getLocalTime, getTimezoneInfo, loading, error }) => {
  const [unit, setUnit] = useState("celsius"); // 'celsius' or 'fahrenheit'

  const toggleUnit = () => {
    setUnit(unit === "celsius" ? "fahrenheit" : "celsius");
  };

  const convertToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  const getTemperature = () => {
    if (!weather) return "";
    const celsius = Math.round(weather.temperature);
    if (unit === "celsius") {
      return `${celsius}°C`;
    } else {
      return `${convertToFahrenheit(celsius)}°F`;
    }
  };

  const getFeelsLike = () => {
    if (!weather?.feels_like) return "";
    const celsius = Math.round(weather.feels_like);
    if (unit === "celsius") {
      return `${celsius}°C`;
    } else {
      return `${convertToFahrenheit(celsius)}°F`;
    }
  };

  if (loading) {
    return (
      <div className="weather-card loading-card">
        <div className="loading-spinner"></div>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card error-card">
        <div className="error-icon">🌧️</div>
        <h3>Location Not Found</h3>
        <p className="error-message">{error}</p>
        <div className="error-suggestions">
          <p>Suggestions:</p>
          <ul>
            <li>Check the city name spelling</li>
            <li>Try searching with country code (e.g., "London, UK")</li>
            <li>Enable location services for automatic detection</li>
          </ul>
        </div>
        <button 
          className="retry-button" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-card empty-card">
        <div className="empty-icon">🔍</div>
        <h3>No Weather Data</h3>
        <p>Search for a city to see weather information</p>
      </div>
    );
  }

  return (
    <div className="weather-card">
      <div className="card-header">
        <h2>{weather.city}</h2>
        <div className="unit-toggle" onClick={toggleUnit}>
          <span className={unit === "celsius" ? "active" : ""}>°C</span>
          <span className="separator">|</span>
          <span className={unit === "fahrenheit" ? "active" : ""}>°F</span>
        </div>
      </div>
      
      <div className="time-container">
        <p className="current-time">{getLocalTime()}</p>
        <p className="timezone-info">{getTimezoneInfo()}</p>
      </div>
      
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.description}
      />
      
      <div className="temperature-container">
        <p className="temperature">{getTemperature()}</p>
        {weather.feels_like && (
          <p className="feels-like">Feels like: {getFeelsLike()}</p>
        )}
      </div>
      
      <p className="humidity">Humidity: {weather.humidity}%</p>
      <p className="description">{weather.description}</p>
      
      {weather.wind_speed && (
        <p className="wind-speed">
          Wind: {unit === "celsius" ? weather.wind_speed : Math.round(weather.wind_speed * 0.621371)} {unit === "celsius" ? "km/h" : "mph"}
        </p>
      )}
      
      <iframe
        title="map"
        className="map"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${weather.lat},${weather.lon}&z=12&output=embed`}
      />
    </div>
  );
};

export default WeatherCard;