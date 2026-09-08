import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import { getAttempts } from "../../services/attemptService";

const AttemptHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const data = await getAttempts();
        // Most recent first
        setAttempts([...data].sort((a, b) => new Date(b.started_at) - new Date(a.started_at)));
      } catch {
        setError("Failed to load attempt history.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  if (loading) return <Loading message="Loading attempts..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1>My Attempts</h1>
            <p className="page-subtitle">{attempts.length} total attempt{attempts.length !== 1 ? "s" : ""}</p>
          </div>

          <ErrorMessage message={error} />

          {!error && attempts.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No attempts yet"
              description="You haven't attempted any quizzes yet."
              actionLabel="Browse Quizzes"
              actionPath="/student/quizzes"
            />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Quiz ID</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, idx) => {
                    const pct =
                      attempt.total_marks > 0
                        ? Math.round((attempt.score / attempt.total_marks) * 100)
                        : 0;
                    return (
                      <tr key={attempt.id}>
                        <td>{idx + 1}</td>
                        <td>Quiz #{attempt.quiz}</td>
                        <td>
                          {attempt.completed
                            ? `${attempt.score} / ${attempt.total_marks}`
                            : "—"}
                        </td>
                        <td>{attempt.completed ? `${pct}%` : "—"}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              !attempt.completed
                                ? "pending"
                                : attempt.is_passed
                                ? "passed"
                                : "failed"
                            }`}
                          >
                            {!attempt.completed
                              ? "In Progress"
                              : attempt.is_passed
                              ? "Passed"
                              : "Failed"}
                          </span>
                        </td>
                        <td>
                          {new Date(attempt.started_at).toLocaleDateString()}
                        </td>
                        <td>
                          {attempt.completed && (
                            <button
                              className="btn btn-outline-sm"
                              onClick={() =>
                                navigate(`/student/result/${attempt.id}`)
                              }
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptHistory;
