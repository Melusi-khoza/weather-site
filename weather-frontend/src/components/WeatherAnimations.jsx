import React from "react";

const WeatherAnimations = ({ effects, weatherClass, isNight }) => {
  const {
    rainDrops, rainSplashes, rainRipples, snowFlakes, clouds,
    stars, shootingStars, sunRays, fogLayers, lightning,
    aurora, moon
  } = effects;

  return (
    <div className="overlay-container">
      {/* Sun Effects */}
      {weatherClass === "clear" && !isNight && (
        <>
          <div className="sun-glow"></div>
          {sunRays.map((ray, i) => (
            <div
              key={`ray-${i}`}
              className="sun-ray"
              style={{
                transform: `rotate(${ray.rotation}deg)`,
                animationDelay: `${ray.delay}s`,
              }}
            />
          ))}
          <div className="heat-haze"></div>
          <div className="sun-beam"></div>
        </>
      )}

      {/* Moon & Stars */}
      {(weatherClass === "night" || (moon && isNight)) && (
        <>
          <div className="moon-glow"></div>
          <div className="moon"></div>
          {stars.map((star, i) => (
            <div
              key={`star-${i}`}
              className={star.className}
              style={{
                left: star.left,
                top: star.top,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
          {shootingStars.map((star, i) => (
            <div
              key={`shooting-${i}`}
              className="shooting-star"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
          {aurora && <div className="aurora"></div>}
          <div className="milky-way"></div>
          <div className="constellation"></div>
        </>
      )}

      {/* Rain Effects */}
      {rainDrops.map((drop, i) => (
        <div
          key={`rain-${i}`}
          className={drop.className || "rain-drop"}
          style={{
            left: drop.left,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
      
      {rainSplashes.map((splash, i) => (
        <div
          key={`splash-${i}`}
          className="rain-splash"
          style={{
            left: splash.left,
            bottom: splash.bottom,
            animationDelay: `${splash.delay}s`,
          }}
        />
      ))}
      
      {rainRipples.map((ripple, i) => (
        <div
          key={`ripple-${i}`}
          className="rain-ripple"
          style={{
            left: ripple.left,
            bottom: ripple.bottom,
            animationDelay: `${ripple.delay}s`,
          }}
        />
      ))}

      {/* Snow Effects */}
      {snowFlakes.map((flake, i) => (
        <div
          key={`snow-${i}`}
          className={flake.className || "snowflake"}
          style={{
            left: flake.left,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        />
      ))}
      
      {snowFlakes.length > 0 && (
        <>
          <div className="snow-drift"></div>
          <div className="frost-effect"></div>
        </>
      )}

      {/* Cloud Effects */}
      {clouds.map((cloud, i) => (
        <div
          key={`cloud-${i}`}
          className={cloud.className}
          style={{
            top: `${cloud.top}%`,
            left: cloud.left,
            animationDelay: `${cloud.delay}s`,
            animationDuration: `${cloud.duration}s`,
          }}
        />
      ))}

      {/* Fog Effects */}
      {fogLayers.map((fog, i) => (
        <div
          key={`fog-${i}`}
          className="fog-layer"
          style={{
            top: `${fog.top}%`,
            opacity: fog.opacity,
            animationDelay: `${fog.delay}s`,
            animationDuration: `${fog.duration}s`,
          }}
        />
      ))}

      {/* Thunderstorm Effects */}
      {lightning.map((bolt, i) => (
        <div
          key={`lightning-${i}`}
          className="lightning-flash"
          style={{ animationDelay: `${bolt.delay}s` }}
        />
      ))}
      
      {lightning.length > 0 && (
        <>
          <div className="thunder-cloud"></div>
          <div className="thunder-rumble"></div>
        </>
      )}
    </div>
  );
};

export default WeatherAnimations;