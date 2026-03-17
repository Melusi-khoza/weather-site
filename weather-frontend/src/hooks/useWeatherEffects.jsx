import { useState } from "react";

export const useWeatherEffects = () => {
  const [rainDrops, setRainDrops] = useState([]);
  const [rainSplashes, setRainSplashes] = useState([]);
  const [rainRipples, setRainRipples] = useState([]);
  const [snowFlakes, setSnowFlakes] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  const [sunRays, setSunRays] = useState([]);
  const [fogLayers, setFogLayers] = useState([]);
  const [lightning, setLightning] = useState([]);
  const [aurora, setAurora] = useState(false);
  const [moon, setMoon] = useState(false);
  const [lastWeatherClass, setLastWeatherClass] = useState("clear");

  const createRain = (intensity = "normal") => {
    const dropCount = intensity === "heavy" ? 200 : intensity === "light" ? 50 : 100;
    const drops = Array.from({ length: dropCount }, () => ({
      left: Math.random() * window.innerWidth,
      delay: Math.random() * 5,
      duration: intensity === "heavy" ? 0.3 + Math.random() * 0.2 : 0.5 + Math.random() * 0.5,
      className: `rain-drop ${intensity === "heavy" ? "heavy" : intensity === "light" ? "light" : ""}`,
    }));

    const splashes = Array.from({ length: 20 }, () => ({
      left: Math.random() * window.innerWidth,
      bottom: 0,
      delay: Math.random() * 3,
    }));

    const ripples = Array.from({ length: 15 }, () => ({
      left: Math.random() * window.innerWidth,
      bottom: Math.random() * 100,
      delay: Math.random() * 4,
    }));

    setRainDrops(drops);
    setRainSplashes(splashes);
    setRainRipples(ripples);
  };

  const createSnow = (intensity = "normal") => {
    const flakeCount = intensity === "heavy" ? 100 : intensity === "light" ? 25 : 50;
    const flakes = Array.from({ length: flakeCount }, () => {
      const type = Math.random();
      let className = "snowflake";
      if (type < 0.3) className = "snowflake flurry";
      else if (type > 0.7) className = "snowflake blizzard";
      return {
        left: Math.random() * window.innerWidth,
        delay: Math.random() * 5,
        duration: intensity === "heavy" ? 1 + Math.random() * 1 : 3 + Math.random() * 3,
        className,
      };
    });
    setSnowFlakes(flakes);
  };

  const createClouds = () => {
    const cloudTypes = ["cloud-overlay", "cloud-rain", "cloud-snow"];
    const c = Array.from({ length: 8 }, () => ({
      top: Math.random() * 70,
      left: Math.random() * window.innerWidth,
      className: cloudTypes[Math.floor(Math.random() * cloudTypes.length)],
      delay: Math.random() * 10,
      duration: 120 + Math.random() * 60,
    }));
    setClouds(c);
  };

  const createNightEffects = () => {
    const starCount = 200;
    const stars_array = Array.from({ length: starCount }, () => {
      const size = Math.random();
      let className = "star small";
      if (size > 0.7) className = "star large";
      else if (size > 0.3) className = "star medium";
      return {
        left: Math.random() * window.innerWidth,
        top: Math.random() * window.innerHeight,
        className,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
      };
    });

    const shooting_array = Array.from({ length: 3 }, () => ({
      left: Math.random() * window.innerWidth,
      top: Math.random() * window.innerHeight * 0.3,
      delay: Math.random() * 10,
    }));

    setStars(stars_array);
    setShootingStars(shooting_array);
    setMoon(true);
    if (Math.random() < 0.05) setAurora(true);
  };

  const createSunEffects = () => {
    const rays = Array.from({ length: 12 }, (_, i) => ({
      rotation: i * 30 + Math.random() * 10,
      delay: Math.random() * 2,
    }));
    setSunRays(rays);
  };

  const createFog = () => {
    const layers = Array.from({ length: 5 }, (_, i) => ({
      top: i * 20,
      opacity: 0.1 + Math.random() * 0.2,
      delay: Math.random() * 5,
      duration: 20 + Math.random() * 10,
    }));
    setFogLayers(layers);
  };

  const createThunderstorm = () => {
    createRain("heavy");
    const lightning_array = Array.from({ length: 5 }, (_, i) => ({
      left: 100 + Math.random() * 500,
      top: 50 + Math.random() * 200,
      delay: i * 2 + Math.random() * 3,
    }));
    setLightning(lightning_array);
  };

  const clearAllEffects = () => {
    setRainDrops([]); setRainSplashes([]); setRainRipples([]);
    setSnowFlakes([]); setClouds([]); setStars([]);
    setShootingStars([]); setSunRays([]); setFogLayers([]);
    setLightning([]); setAurora(false); setMoon(false);
  };

  const updateWeatherEffects = (desc) => {
    clearAllEffects();
    const hour = new Date().getHours();
    const isNight = hour > 18 || hour < 6;

    if (desc.includes("thunder") || desc.includes("lightning")) {
      createThunderstorm();
      setLastWeatherClass("thunderstorm");
    } else if (desc.includes("rain")) {
      if (desc.includes("heavy")) createRain("heavy");
      else if (desc.includes("light")) createRain("light");
      else createRain("normal");
      setLastWeatherClass("rainy");
    } else if (desc.includes("snow")) {
      if (desc.includes("heavy")) createSnow("heavy");
      else if (desc.includes("light")) createSnow("light");
      else createSnow("normal");
      setLastWeatherClass("snowy");
    } else if (desc.includes("cloud")) {
      createClouds();
      setLastWeatherClass("cloudy");
    } else if (desc.includes("fog") || desc.includes("mist")) {
      createFog();
      setLastWeatherClass("foggy");
    } else if (desc.includes("clear") || desc.includes("sun")) {
      if (isNight) {
        createNightEffects();
        setLastWeatherClass("night");
      } else {
        createSunEffects();
        setLastWeatherClass("clear");
      }
    }

    if (isNight && !desc.includes("rain") && !desc.includes("snow") && 
        !desc.includes("cloud") && !desc.includes("thunder") && !desc.includes("fog")) {
      createNightEffects();
      setLastWeatherClass("night");
    }
  };

  return {
    effects: {
      rainDrops, rainSplashes, rainRipples, snowFlakes, clouds,
      stars, shootingStars, sunRays, fogLayers, lightning,
      aurora, moon, lastWeatherClass
    },
    updateWeatherEffects,
    clearAllEffects
  };
};