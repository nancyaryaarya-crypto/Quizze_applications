import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { getQuizzes, deleteQuiz } from "../../services/quizService";

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const navigate = useNavigate();

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getQuizzes();
      setQuizzes(data);
      setFiltered(data);
    } catch {
      setError("Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuizzes(); }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      quizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(val) ||
          (q.topic_name && q.topic_name.toLowerCase().includes(val))
      )
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteQuiz(deleteTarget.id);
      setToast({ message: "Quiz deleted successfully.", type: "success" });
      setDeleteTarget(null);
      loadQuizzes();
    } catch {
      setToast({ message: "Failed to delete quiz.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading message="Loading quizzes..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Manage Quizzes</h1>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/quizzes/create")}
            >
              + Create Quiz
            </button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search quizzes..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <ErrorMessage message={error} />
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "" })}
          />

          {!error && filtered.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No quizzes found"
              description="Create your first quiz to get started."
              actionLabel="Create Quiz"
              actionPath="/admin/quizzes/create"
            />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Topic</th>
                    <th>Total Marks</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((quiz, idx) => (
                    <tr key={quiz.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{quiz.title}</strong></td>
                      <td>{quiz.topic_name}</td>
                      <td>{quiz.total_marks}</td>
                      <td>{quiz.time_limit} min</td>
                      <td>
                        <span className={`status-badge ${quiz.is_active ? "active" : "inactive"}`}>
                          {quiz.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="action-td">
                        <button
                          className="btn btn-outline-sm"
                          onClick={() => navigate(`/admin/quizzes/${quiz.id}/questions`)}
                          title="Manage Questions"
                        >
                          ❓
                        </button>
                        <button
                          className="btn btn-outline-sm"
                          onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                          title="Edit Quiz Settings"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger-sm"
                          onClick={() => setDeleteTarget(quiz)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Delete Confirm Modal */}
          <Modal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            title="Delete Quiz"
          >
            <div className="confirm-modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>&quot;{deleteTarget?.title}&quot;</strong>?
              </p>
              <p className="confirm-warning">
                ⚠️ This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ManageQuizzes;
