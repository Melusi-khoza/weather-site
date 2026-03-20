import { useState } from "react";
import axios from "axios";

export const useLocation = (UniqueString) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${UniqueString}`,
      );
      const cities = res.data.map((c) => ({
        name: c.name,
        state: c.state,
        country: c.country,
        lat: c.lat,
        lon: c.lon,
        displayName: `${c.name}${c.state ? `, ${c.state}` : ""}, ${c.country}`,
      }));
      setSuggestions(cities);
    } catch (err) {
      console.error("Suggestions error:", err);
      setSuggestions([]);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    selectedLocation,
    setSelectedLocation,
    fetchSuggestions,
    clearSuggestions,
  };
};
