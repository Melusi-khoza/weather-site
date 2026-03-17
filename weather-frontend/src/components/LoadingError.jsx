import React from "react";

const LoadingError = ({ loading, error }) => {
  return (
    <>
      {loading && <p className="loading">Loading weather...</p>}
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default LoadingError;