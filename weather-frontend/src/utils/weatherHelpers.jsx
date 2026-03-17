// Check if it's night time
export const isNightTime = () => {
  const hour = new Date().getHours();
  return hour > 18 || hour < 6;
};

// Get weather class based on description
export const getWeatherClass = (description, loading, lastClass) => {
  if (loading) return lastClass;
  if (!description) return "";
  
  const desc = description.toLowerCase();
  const isNight = isNightTime();

  if (desc.includes("thunder") || desc.includes("lightning")) return "thunderstorm";
  if (desc.includes("rain")) return "rainy";
  if (desc.includes("snow")) return "snowy";
  if (desc.includes("cloud")) return "cloudy";
  if (desc.includes("fog") || desc.includes("mist")) return "foggy";
  if (desc.includes("clear")) {
    if (isNight) return "night";
    return "clear";
  }
  return "";
};

// Get alert color based on severity
export const getAlertColor = (severity) => {
  switch (severity) {
    case "critical": return "#ff4444";
    case "high": return "#ff6b6b";
    case "medium": return "#ffa502";
    case "low": return "#4b7bec";
    default: return "#ffa502";
  }
};