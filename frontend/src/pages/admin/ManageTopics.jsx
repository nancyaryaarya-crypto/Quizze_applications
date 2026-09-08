import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { getTopics, deleteTopic } from "../../services/topicService";

const ManageTopics = () => {
  const [topics, setTopics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const navigate = useNavigate();

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await getTopics();
      setTopics(data);
      setFiltered(data);
    } catch {
      setError("Failed to load topics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTopics(); }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(topics.filter((t) => t.name.toLowerCase().includes(val)));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTopic(deleteTarget.id);
      setToast({ message: "Topic deleted successfully.", type: "success" });
      setDeleteTarget(null);
      loadTopics();
    } catch {
      setToast({ message: "Failed to delete topic.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading message="Loading topics..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Manage Topics</h1>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/topics/create")}
            >
              + Create Topic
            </button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search topics..."
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
              icon="📚"
              title="No topics found"
              description="Create your first topic to get started."
              actionLabel="Create Topic"
              actionPath="/admin/topics/create"
            />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((topic, idx) => (
                    <tr key={topic.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{topic.name}</strong></td>
                      <td className="td-truncate">{topic.description || "—"}</td>
                      <td>
                        <span className={`status-badge ${topic.is_active ? "active" : "inactive"}`}>
                          {topic.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{new Date(topic.created_at).toLocaleDateString()}</td>
                      <td className="action-td">
                        <button
                          className="btn btn-outline-sm"
                          onClick={() => navigate(`/admin/topics/${topic.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger-sm"
                          onClick={() => setDeleteTarget(topic)}
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
            title="Delete Topic"
          >
            <div className="confirm-modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>&quot;{deleteTarget?.name}&quot;</strong>?
              </p>
              <p className="confirm-warning">
                ⚠️ This will permanently remove the topic.
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

export default ManageTopics;
