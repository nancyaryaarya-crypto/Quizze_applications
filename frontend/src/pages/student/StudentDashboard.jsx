import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import useAuth from "../../hooks/useAuth";
import { getAttempts } from "../../services/attemptService";
import { getQuizzes } from "../../services/quizService";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attemptsData, quizzesData] = await Promise.all([
          getAttempts(),
          getQuizzes(),
        ]);
        setAttempts(attemptsData);
        setQuizzes(quizzesData);
      } catch {
        // Silently fail — page still renders with partial data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedAttempts = attempts.filter((a) => a.completed);
  const inProgressAttempts = attempts.filter((a) => !a.completed);

  const avgScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce((sum, a) => {
            const pct = a.total_marks > 0 ? (a.score / a.total_marks) * 100 : 0;
            return sum + pct;
          }, 0) / completedAttempts.length
        )
      : 0;

  const totalQuizzes = quizzes.length;
  const learningProgress = totalQuizzes > 0 ? Math.round((completedAttempts.length / totalQuizzes) * 100) : 0;

  const recentAttempts = [...completedAttempts]
    .sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
    .slice(0, 5);

  const recommendedTopics = [
    { icon: "🐍", name: "Python", desc: "Learn backend basics", color: "color-2" },
    { icon: "⚛️", name: "React", desc: "Build modern UIs", color: "color-3" },
    { icon: "📜", name: "JavaScript", desc: "Master web logic", color: "color-4" },
    { icon: "🎨", name: "HTML & CSS", desc: "Structure & style", color: "color-5" },
    { icon: "🗄️", name: "SQL", desc: "Database mastery", color: "color-2" },
  ];

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Welcome back, {currentUser?.username} 👋</h1>
              <p>Continue your learning journey and improve your skills.</p>
            </div>
            <div className="welcome-image">
              🎓
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card modern-stat">
              <div className="stat-icon-wrap bg-color-2 text-color-2">📚</div>
              <div className="stat-info">
                <h3>{totalQuizzes}</h3>
                <p>Total Quizzes</p>
              </div>
            </div>
            <div className="stat-card modern-stat">
              <div className="stat-icon-wrap bg-color-3 text-color-3">✅</div>
              <div className="stat-info">
                <h3>{completedAttempts.length}</h3>
                <p>Quizzes Completed</p>
              </div>
            </div>
            <div className="stat-card modern-stat">
              <div className="stat-icon-wrap bg-color-4 text-color-4">🏆</div>
              <div className="stat-info">
                <h3>{avgScore}%</h3>
                <p>Average Score</p>
              </div>
            </div>
            <div className="stat-card modern-stat">
              <div className="stat-icon-wrap bg-color-5 text-color-5">📈</div>
              <div className="stat-info">
                <h3>{learningProgress}%</h3>
                <p>Learning Progress</p>
              </div>
            </div>
          </div>

          <div className="dashboard-columns">
            <div className="left-column">
              <div className="section-card continue-learning">
                <div className="section-header">
                  <h2>Continue Learning</h2>
                </div>
                {inProgressAttempts.length === 0 ? (
                  <div className="empty-inline modern-empty">
                    <div className="empty-icon">🚀</div>
                    <p>No quizzes in progress. Ready for a new challenge?</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/student/quizzes")}
                    >
                      Browse Quizzes
                    </button>
                  </div>
                ) : (
                  <div className="in-progress-list">
                    {inProgressAttempts.map((attempt) => {
                      const quizDetails = quizzes.find((q) => q.id === attempt.quiz) || {};
                      const progressPct = attempt.total_marks > 0 ? Math.round((attempt.score / attempt.total_marks) * 100) : 50; // Mock progress for incomplete
                      return (
                        <div key={attempt.id} className="progress-card">
                          <div className="progress-card-info">
                            <h4>{quizDetails.title || `Quiz #${attempt.quiz}`}</h4>
                            <span className="topic-tag">{quizDetails.topic_name || 'Topic'}</span>
                          </div>
                          <div className="progress-card-bar">
                            <div className="progress-bar-bg">
                              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                            </div>
                            <span className="progress-pct">{progressPct}%</span>
                          </div>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/student/quiz/${attempt.id}`)}
                          >
                            Continue
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="section-card recent-attempts">
                <div className="section-header">
                  <h2>Recent Attempts</h2>
                  <button
                    className="btn btn-text"
                    onClick={() => navigate("/student/attempts")}
                  >
                    View All →
                  </button>
                </div>
                {recentAttempts.length === 0 ? (
                  <p className="text-muted">No completed quizzes yet.</p>
                ) : (
                  <div className="recent-list">
                    {recentAttempts.map((attempt) => {
                      const quizDetails = quizzes.find((q) => q.id === attempt.quiz) || {};
                      return (
                        <div key={attempt.id} className="recent-item">
                          <div className="recent-item-main">
                            <h4>{quizDetails.title || `Quiz #${attempt.quiz}`}</h4>
                            <span className="recent-date">{new Date(attempt.started_at).toLocaleDateString()}</span>
                          </div>
                          <div className="recent-item-score">
                            <span className={`status-pill ${attempt.is_passed ? "passed" : "failed"}`}>
                              {attempt.is_passed ? "Passed" : "Failed"}
                            </span>
                            <strong>{attempt.score}/{attempt.total_marks}</strong>
                          </div>
                          <button 
                            className="btn btn-outline-sm"
                            onClick={() => navigate(`/student/result/${attempt.id}`)}
                          >
                            View Result
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="right-column">
              <div className="section-card recommended-topics">
                <div className="section-header">
                  <h2>Recommended Topics</h2>
                </div>
                <div className="topics-list">
                  {recommendedTopics.map((topic, index) => (
                    <div key={index} className="topic-card-small" onClick={() => navigate("/student/topics")}>
                      <div className={`topic-icon stat-icon-wrap bg-${topic.color} text-${topic.color}`} style={{ width: "48px", height: "48px", fontSize: "1.2rem", marginRight: "1rem" }}>{topic.icon}</div>
                      <div className="topic-info">
                        <h4>{topic.name}</h4>
                        <p>{topic.desc}</p>
                      </div>
                      <div className="topic-arrow">→</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
