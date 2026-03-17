import { useState, useEffect } from "react";

export const useTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState(null);

  // Live time update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time for specific timezone
  const getLocalTime = () => {
    if (!timeZone) {
      // Fallback to system time if no timezone
      return currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    try {
      // Format time for the specific timezone
      return currentTime.toLocaleTimeString("en-US", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (error) {
      // Fallback if timezone is invalid
      return currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
  };

  // Get timezone abbreviation or offset
  const getTimezoneInfo = () => {
    if (!timeZone) return "";

    try {
      const offset = new Date()
        .toLocaleTimeString("en-US", {
          timeZone: timeZone,
          timeZoneName: "short",
        })
        .split(" ")
        .pop();

      return offset;
    } catch {
      return "";
    }
  };

  // Get current date
  const getCurrentDate = () => {
    if (!timeZone) {
      return currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    try {
      return currentTime.toLocaleDateString("en-US", {
        timeZone: timeZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return {
    currentTime,
    timeZone,
    setTimeZone,
    getLocalTime,
    getTimezoneInfo,
    getCurrentDate
  };
};