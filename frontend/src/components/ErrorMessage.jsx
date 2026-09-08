import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
