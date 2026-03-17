import React from "react";

const SuggestionsList = ({ suggestions, onSuggestionClick, loading }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestions">
      {suggestions.map((s, i) => (
        <div
          key={i}
          onClick={() => onSuggestionClick(s)}
          className="suggestion-item"
        >
          {s.displayName}
        </div>
      ))}
      {loading && <div className="suggestions-loading">Loading suggestions...</div>}
    </div>
  );
};

export default SuggestionsList;