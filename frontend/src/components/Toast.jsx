import React, { useState, useEffect } from "react";

// Simple toast notification — auto-dismisses after 3s
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span>{type === "success" ? "✅" : "❌"} {message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
};

export default Toast;
