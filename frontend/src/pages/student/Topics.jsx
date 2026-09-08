import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import TopicCard from "../../components/TopicCard";
import { getTopics } from "../../services/topicService";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch {
        setError("Failed to load topics.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (loading) return <Loading message="Loading topics..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Topics</h1>
            <p className="page-subtitle">{topics.length} topic{topics.length !== 1 ? "s" : ""} available</p>
          </div>

          <ErrorMessage message={error} />

          {!error && topics.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No topics available"
              description="Topics will appear here once the admin creates them."
            />
          ) : (
            <div className="topics-grid">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topics;
