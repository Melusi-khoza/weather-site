import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";

// Components
import SearchBar from "./components/SearchBar";
import SuggestionsList from "./components/SuggestionsList";
import WeatherCard from "./components/WeatherCard";
import ForecastSection from "./components/ForecastSection";
import WeatherAlerts from "./components/WeatherAlerts";
import WeatherAnimations from "./components/WeatherAnimations";
import LoadingError from "./components/LoadingError";

// Hooks
import { useWeather } from "./hooks/useWeather";
import { useForecast } from "./hooks/useForecast";
import { useWeatherEffects } from "./hooks/useWeatherEffects";
import { useLocation } from "./hooks/useLocation";
import { useTime } from "./hooks/useTime";

// Utils
import { getWeatherClass, isNightTime } from "./utils/weatherHelpers";

function App() {
  const [city, setCity] = useState("");
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const UniqueString = "f3c2d27701b416b32fd6b26943dadfd2";

  // Custom hooks
  const {
    weather,
    loading,
    error,
    fetchWeather,
    fetchWeatherByLocation,
    setError,
  } = useWeather();
  const { forecast, fetchForecast } = useForecast();
  const { effects, updateWeatherEffects, clearAllEffects } =
    useWeatherEffects();
  const {
    suggestions,
    selectedLocation,
    setSelectedLocation,
    fetchSuggestions,
    clearSuggestions,
  } = useLocation(UniqueString);
  const { currentTime, timeZone, setTimeZone, getLocalTime, getTimezoneInfo } =
    useTime();

  // On page load, get user's location
  useEffect(() => {
    if (!initialLoadDone) {
      getLocationWeather();
      setInitialLoadDone(true);
    }
  }, [initialLoadDone]);

  // Update timezone when weather changes
  useEffect(() => {
    if (weather?.timezone) setTimeZone(weather.timezone);
  }, [weather]);

  // Check weather alerts
  useEffect(() => {
    if (forecast.hourly?.length) checkWeatherAlerts();
  }, [forecast]);

  const checkWeatherAlerts = () => {
    const alerts = [];
    const now = new Date();

    for (let i = 0; i < Math.min(5, forecast.hourly.length); i++) {
      const hourData = forecast.hourly[i];
      const hourTime = new Date(hourData.time);
      const hourDiff = (hourTime - now) / (1000 * 60 * 60);

      if (hourDiff >= 0 && hourDiff <= 5) {
        const temp = parseFloat(hourData.temp);
        const desc = hourData.description?.toLowerCase() || "";
        const windSpeed = parseFloat(hourData.wind_speed) || 0;

        if (desc.includes("thunder") || desc.includes("lightning")) {
          alerts.push({
            type: "danger",
            icon: "⚡",
            title: "Thunderstorm Warning",
            message: `Thunderstorm expected at ${hourData.time}`,
            time: hourData.time,
            severity: "high",
          });
        } else if (
          desc.includes("heavy rain") ||
          (desc.includes("rain") && hourData.pop > 70)
        ) {
          alerts.push({
            type: "warning",
            icon: "🌧️",
            title: "Heavy Rain Alert",
            message: `Heavy rainfall expected at ${hourData.time}`,
            time: hourData.time,
            severity: "medium",
          });
        } else if (temp > 35) {
          alerts.push({
            type: "warning",
            icon: "🔥",
            title: "Extreme Heat Warning",
            message: `Temperature will reach ${hourData.temp}°C at ${hourData.time}`,
            time: hourData.time,
            severity: "high",
          });
        } else if (temp < 0) {
          alerts.push({
            type: "info",
            icon: "❄️",
            title: "Freezing Temperature",
            message: `Temperature will drop to ${hourData.temp}°C at ${hourData.time}`,
            time: hourData.time,
            severity: "medium",
          });
        } else if (windSpeed > 50) {
          alerts.push({
            type: "warning",
            icon: "💨",
            title: "Strong Wind Warning",
            message: `Wind speeds of ${hourData.wind_speed} km/h expected at ${hourData.time}`,
            time: hourData.time,
            severity: "high",
          });
        }
      }
    }

    setWeatherAlerts(alerts);
    setShowAlerts(alerts.length > 0);
  };

  // FIXED: Working location handler
  const getLocationWeather = () => {
    console.log("Getting location...");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      handleDefaultCity();
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("Location obtained:", position.coords);
        const { latitude, longitude } = position.coords;

        try {
          const weatherData = await fetchWeatherByLocation(latitude, longitude);
          console.log("Weather data from location:", weatherData);

          if (weatherData && weatherData.city) {
            setCity(weatherData.city);
            setSelectedLocation({
              lat: latitude,
              lon: longitude,
              name: weatherData.city,
            });

            await fetchForecast(weatherData.city);
            updateWeatherEffects(weatherData.description?.toLowerCase() || "");
            setError("");
          } else {
            throw new Error("Invalid weather data");
          }
        } catch (error) {
          console.error("Error fetching weather for location:", error);
          setError("Unable to fetch weather for your location");
          await handleDefaultCity();
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }

        setError(errorMessage);
        setLocationLoading(false);
        handleDefaultCity();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleDefaultCity = async () => {
    console.log("Attempting to get user's location as default...");

    if (!navigator.geolocation) {
      console.log("Geolocation not supported, cannot get user location");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("Default location obtained:", position.coords);
        const { latitude, longitude } = position.coords;

        try {
          const weatherData = await fetchWeatherByLocation(latitude, longitude);
          console.log("Default weather data:", weatherData);

          if (weatherData && weatherData.city) {
            setCity(weatherData.city);
            setSelectedLocation({
              lat: latitude,
              lon: longitude,
              name: weatherData.city,
            });

            await fetchForecast(weatherData.city);
            updateWeatherEffects(weatherData.description?.toLowerCase() || "");
            setError("");
          }
        } catch (error) {
          console.error("Error fetching default location weather:", error);
          setError("Unable to fetch weather for your location");
        }
      },
      (error) => {
        console.error("Default geolocation error:", error);
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please search for a city.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information unavailable. Please search for a city.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Location request timed out. Please search for a city.";
            break;
        }
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleCityChange = async (e) => {
    const value = e.target.value;
    setCity(value);
    setSelectedLocation(null);
    await fetchSuggestions(value);
  };

  const handleSuggestionClick = async (suggestion) => {
    setCity(suggestion.displayName);
    setSelectedLocation({
      lat: suggestion.lat,
      lon: suggestion.lon,
      name: suggestion.name,
    });
    clearSuggestions();

    const weatherData = await fetchWeatherByLocation(
      suggestion.lat,
      suggestion.lon,
    );
    if (weatherData) {
      await fetchForecast(weatherData.city);
      updateWeatherEffects(weatherData.description?.toLowerCase() || "");
    }
  };

  const handleSearchClick = async () => {
    if (!city.trim()) return;
    if (selectedLocation) {
      const weatherData = await fetchWeatherByLocation(
        selectedLocation.lat,
        selectedLocation.lon,
      );
      if (weatherData) {
        await fetchForecast(weatherData.city);
        updateWeatherEffects(weatherData.description?.toLowerCase() || "");
      }
    } else {
      const weatherData = await fetchWeather(city);
      if (weatherData) {
        await fetchForecast(city);
        updateWeatherEffects(weatherData.description?.toLowerCase() || "");
      }
    }
  };

  // This function is passed to the SearchBar
  const handleLocationClick = () => {
    getLocationWeather();
  };

  const weatherClass = getWeatherClass(
    weather?.description,
    loading,
    effects.lastWeatherClass,
  );

  return (
    <>
      <div className={`container ${weatherClass}`}>
        <h1>World Weather Site</h1>

        <SearchBar
          city={city}
          onCityChange={handleCityChange}
          onSearch={handleSearchClick}
          onLocationClick={handleLocationClick}
          loading={loading}
          locationLoading={locationLoading}
        />

        <SuggestionsList
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />

        <WeatherAlerts
          alerts={weatherAlerts}
          onDismiss={(index) => {
            const newAlerts = [...weatherAlerts];
            newAlerts.splice(index, 1);
            setWeatherAlerts(newAlerts);
            setShowAlerts(newAlerts.length > 0);
          }}
          onDismissAll={() => {
            setWeatherAlerts([]);
            setShowAlerts(false);
          }}
        />

        <LoadingError loading={loading} error={error} />

        <div className="main-content">
          <div className="left-column">
            <WeatherCard
              weather={weather}
              getLocalTime={getLocalTime}
              getTimezoneInfo={getTimezoneInfo}
              loading={loading}
              error={error}
            />
          </div>

          <ForecastSection forecast={forecast} weatherAlerts={weatherAlerts} />
        </div>

        <WeatherAnimations
          effects={effects}
          weatherClass={weatherClass}
          isNight={isNightTime()}
        />
      </div>
      <Footer />
    </>
  );
}

export default App;
