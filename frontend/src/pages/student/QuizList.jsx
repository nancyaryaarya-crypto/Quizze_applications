import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import QuizCard from "../../components/QuizCard";
import { getQuizzes } from "../../services/quizService";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
        setFiltered(data);
      } catch {
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      quizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(val) ||
          (q.topic && q.topic.toLowerCase().includes(val)) ||
          (q.description && q.description.toLowerCase().includes(val))
      )
    );
  };

  if (loading) return <Loading message="Loading quizzes..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Available Quizzes</h1>
            <p className="page-subtitle">
              {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} available
            </p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search quizzes by title or topic..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <ErrorMessage message={error} />

          {!error && filtered.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No quizzes found"
              description={
                search
                  ? "Try a different search term."
                  : "No quizzes are available yet. Check back later."
              }
            />
          ) : (
            <div className="quiz-grid">
              {filtered.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizList;
