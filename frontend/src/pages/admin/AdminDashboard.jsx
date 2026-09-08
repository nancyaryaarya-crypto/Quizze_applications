import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import useAuth from "../../hooks/useAuth";
import { getQuizzes } from "../../services/quizService";
import { getTopics } from "../../services/topicService";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, topicsData] = await Promise.all([
          getQuizzes(),
          getTopics(),
        ]);
        setQuizzes(quizzesData);
        setTopics(topicsData);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;

  const activeQuizzes = quizzes.filter((q) => q.is_active).length;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p className="page-subtitle">Welcome, {currentUser?.username}</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-value">{quizzes.length}</div>
              <div className="stat-label">Total Quizzes</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{activeQuizzes}</div>
              <div className="stat-label">Active Quizzes</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-value">{topics.length}</div>
              <div className="stat-label">Total Topics</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section-card">
            <h2>Quick Actions</h2>
            <div className="admin-actions-grid">
              <div className="admin-action-card" onClick={() => navigate("/admin/quizzes/create")}>
                <div className="action-icon">➕</div>
                <h3>Create Quiz</h3>
                <p>Add a new quiz for students</p>
              </div>
              <div className="admin-action-card" onClick={() => navigate("/admin/topics/create")}>
                <div className="action-icon">➕</div>
                <h3>Create Topic</h3>
                <p>Add a new topic category</p>
              </div>
              <div className="admin-action-card" onClick={() => navigate("/admin/quizzes")}>
                <div className="action-icon">📋</div>
                <h3>Manage Quizzes</h3>
                <p>View, edit and delete quizzes</p>
              </div>
              <div className="admin-action-card" onClick={() => navigate("/admin/topics")}>
                <div className="action-icon">📚</div>
                <h3>Manage Topics</h3>
                <p>View, edit and delete topics</p>
              </div>
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="section-card">
            <div className="section-header">
              <h2>Recent Quizzes</h2>
              <button className="btn btn-outline-sm" onClick={() => navigate("/admin/quizzes")}>
                View All
              </button>
            </div>
            {quizzes.length === 0 ? (
              <p className="empty-inline-text">No quizzes yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Topic</th>
                      <th>Marks</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.slice(0, 5).map((quiz) => (
                      <tr key={quiz.id}>
                        <td>{quiz.title}</td>
                        <td>{quiz.topic_name}</td>
                        <td>{quiz.total_marks}</td>
                        <td>
                          <span className={`status-badge ${quiz.is_active ? "active" : "inactive"}`}>
                            {quiz.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-sm"
                            onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
