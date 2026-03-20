import React, { useState, useEffect, useRef } from "react";

const WeatherCard = ({ weather, loading, error }) => {
  const [unit, setUnit] = useState("celsius");
  const [currentTime, setCurrentTime] = useState("");
  const [timezoneInfo, setTimezoneInfo] = useState("");
  const intervalRef = useRef(null);

  // ✅ Convert timezone offset → correct local time
  const getLocalTime = (offset) => {
    const nowUTC =
      new Date().getTime() + new Date().getTimezoneOffset() * 60000;

    const localTime = offset !== null
      ? new Date(nowUTC + offset * 1000)
      : new Date();

    return localTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getTimezoneInfo = (offset) => {
    if (offset === null) return "Local Time";
    const hours = offset / 3600;
    const sign = hours >= 0 ? "+" : "-";
    return `UTC${sign}${Math.abs(hours)}`;
  };

  // ✅ Stable clock
  const startClock = (offset) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const update = () => {
      setCurrentTime(getLocalTime(offset));
      setTimezoneInfo(getTimezoneInfo(offset));
    };

    update();
    intervalRef.current = setInterval(update, 1000);
  };

  useEffect(() => {
    if (weather && weather.timezone !== undefined && weather.timezone !== null) {
      startClock(weather.timezone);
    } else {
      startClock(null); // fallback
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [weather]);

  const toggleUnit = () => {
    setUnit(prev => prev === "celsius" ? "fahrenheit" : "celsius");
  };

  const convertToFahrenheit = (c) => Math.round((c * 9) / 5 + 32);
  const convertToKmh = (ms) => Math.round(ms * 3.6);
  const convertToMph = (ms) => Math.round(ms * 2.237);

  const getTemperature = () => {
    if (!weather) return "";
    const c = Math.round(weather.temperature);
    return unit === "celsius" ? `${c}°C` : `${convertToFahrenheit(c)}°F`;
  };

  const getFeelsLike = () => {
    if (!weather?.feels_like) return "";
    const c = Math.round(weather.feels_like);
    return unit === "celsius" ? `${c}°C` : `${convertToFahrenheit(c)}°F`;
  };

  const getWindSpeed = () => {
    if (!weather?.wind_speed) return "N/A";
    return unit === "celsius"
      ? `${convertToKmh(weather.wind_speed)} km/h`
      : `${convertToMph(weather.wind_speed)} mph`;
  };

  if (loading) {
    return <div className="weather-card loading-card">Loading...</div>;
  }

  if (error) {
    return (
      <div className="weather-card error-card">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!weather) {
    return <div className="weather-card">No data</div>;
  }

  return (
    <div className="weather-card">
      <div className="card-header">
        <h2>{weather.city}</h2>

        <div className="unit-toggle" onClick={toggleUnit}>
          <span className={unit === "celsius" ? "active" : ""}>°C</span>
          <span>|</span>
          <span className={unit === "fahrenheit" ? "active" : ""}>°F</span>
        </div>
      </div>

      <div className="time-container">
        <p>{currentTime}</p>
        <p>{timezoneInfo}</p>
      </div>

      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.description}
      />

      <h1>{getTemperature()}</h1>
      {/* <p>Feels like: {getFeelsLike()}</p> */}
      <p>Humidity: <b>{weather.humidity}%</b></p>
      <p>Description: <b>{weather.description}</b></p>
      {/* <p>Wind: {getWindSpeed()}</p> */}

      <iframe
        title="map"
        className="map"
        src={`https://maps.google.com/maps?q=${weather.lat},${weather.lon}&z=12&output=embed`}
      />
    </div>
  );
};

export default WeatherCard;