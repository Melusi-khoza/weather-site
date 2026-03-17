import { useState } from "react";
import axios from "axios";

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return null;
    }
    setLoading(true);
    setError("");
    
    try {
      let searchCity = cityName.split(",")[0].trim();
      const res = await axios.get(
        `http://localhost:8080/weather?city=${encodeURIComponent(searchCity)}`,
        { timeout: 10000 }
      );
      
      setWeather(res.data);
      return res.data;
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout - server not responding");
      } else if (err.response) {
        setError(`Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("Cannot connect to server. Is your backend running?");
      } else {
        setError(`Error: ${err.message}`);
      }
      setWeather(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.get(
        `http://localhost:8080/weather/location?lat=${lat}&lon=${lon}`,
        { timeout: 10000 }
      );
      
      setWeather(res.data);
      return res.data;
    } catch (err) {
      console.error("Location fetch error:", err);
      setError("Unable to fetch weather for your location");
      setWeather(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { weather, loading, error, fetchWeather, fetchWeatherByLocation, setError };
};