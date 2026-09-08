import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getQuiz, updateQuiz } from "../../services/quizService";
import { getTopics } from "../../services/topicService";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, topicsData] = await Promise.all([
          getQuiz(id),
          getTopics(),
        ]);
        setTopics(topicsData);
        // Map quiz detail response to form fields
        const topicMatch = topicsData.find((t) => t.name === quizData.topic_name);
        setFormData({
          title: quizData.title || "",
          description: quizData.description || "",
          topic: topicMatch ? topicMatch.id : "",
          total_marks: quizData.total_marks || "",
          passing_marks: quizData.passing_marks || "",
          time_limit: quizData.time_limit || "",
          is_active: quizData.is_active !== undefined ? quizData.is_active : true,
        });
      } catch {
        setError("Failed to load quiz data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFieldErrors({ title: "Title is required." });
      return;
    }
    if (!formData.topic) {
      setFieldErrors({ topic: "Topic is required." });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        topic: parseInt(formData.topic),
        total_marks: parseInt(formData.total_marks) || 0,
        passing_marks: parseInt(formData.passing_marks) || 0,
        time_limit: parseInt(formData.time_limit) || 1,
        is_active: formData.is_active,
      };
      await updateQuiz(id, payload);
      navigate("/admin/quizzes");
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const mapped = {};
        Object.entries(data).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : v;
        });
        setFieldErrors(mapped);
      } else {
        setError("Failed to update quiz.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading quiz..." />;
  if (error && !formData) {
    return (
      <div className="page-content" style={{ padding: "2rem" }}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <button className="btn-back" onClick={() => navigate("/admin/quizzes")}>
            ← Back to Quizzes
          </button>

          <div className="form-page-card">
            <h1 className="form-page-title">Edit Quiz</h1>

            <ErrorMessage message={error} />

            {formData && (
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label htmlFor="title">Quiz Title *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {fieldErrors.title && (
                    <span className="field-error">{fieldErrors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="topic">Topic *</label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                  >
                    <option value="">-- Select a Topic --</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.topic && (
                    <span className="field-error">{fieldErrors.topic}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="total_marks">Total Marks</label>
                    <input
                      id="total_marks"
                      name="total_marks"
                      type="number"
                      min="0"
                      value={formData.total_marks}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="passing_marks">Passing Marks</label>
                    <input
                      id="passing_marks"
                      name="passing_marks"
                      type="number"
                      min="0"
                      value={formData.passing_marks}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time_limit">Duration (minutes)</label>
                    <input
                      id="time_limit"
                      name="time_limit"
                      type="number"
                      min="1"
                      value={formData.time_limit}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group form-check">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                    <span> Active (visible to students)</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/quizzes")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
