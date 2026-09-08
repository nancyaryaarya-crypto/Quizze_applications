import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyState = ({ icon = "📭", title, description, actionLabel, actionPath }) => {
  const navigate = useNavigate();

  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-description">{description}</p>}
      {actionLabel && actionPath && (
        <button className="btn btn-primary" onClick={() => navigate(actionPath)}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
