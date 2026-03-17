import React from "react";

const SearchBar = ({
  city,
  onCityChange,
  onSearch,
  onLocationClick,
  loading,
  locationLoading
}) => {
  return (
    <div className="search-container">
      <input
        value={city}
        onChange={onCityChange}
        placeholder="Enter city name"
        onKeyPress={(e) => {
          if (e.key === "Enter") onSearch();
        }}
      />
      <button className="search" onClick={onSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
      <button 
        className="location" 
        onClick={onLocationClick} 
        disabled={loading || locationLoading}
      >
        📍 {locationLoading ? "Getting location..." : "My Location"}
      </button>
    </div>
  );
};

export default SearchBar;