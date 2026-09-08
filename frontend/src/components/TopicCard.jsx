import React from "react";

const TopicCard = ({ topic }) => {
  return (
    <div className="topic-card">
      <div className="topic-card-icon">📚</div>
      <div className="topic-card-content">
        <h3 className="topic-name">{topic.name}</h3>
        {topic.description && (
          <p className="topic-desc">{topic.description}</p>
        )}
        <div className="topic-meta">
          <span className={`status-badge ${topic.is_active ? "active" : "inactive"}`}>
            {topic.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
