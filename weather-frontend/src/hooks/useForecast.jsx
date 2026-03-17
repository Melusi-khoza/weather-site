import { useState } from "react";
import axios from "axios";

export const useForecast = () => {
  const [forecast, setForecast] = useState({ hourly: [], daily: [] });

  const fetchForecast = async (cityName) => {
    try {
      let searchCity = cityName.split(",")[0].trim();
      const res = await axios.get(
        `http://localhost:8080/forecast?city=${encodeURIComponent(searchCity)}`
      );
      setForecast({
        hourly: res.data?.hourly || [],
        daily: res.data?.daily || [],
      });
    } catch (err) {
      setForecast({ hourly: [], daily: [] });
    }
  };

  return { forecast, fetchForecast };
};