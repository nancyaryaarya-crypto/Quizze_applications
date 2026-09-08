import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { createQuiz } from "../../services/quizService";
import { getTopics } from "../../services/topicService";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    total_marks: "",
    passing_marks: "",
    time_limit: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch {
        setError("Failed to load topics. Please refresh.");
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError("");
    setFieldErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.topic) errors.topic = "Topic is required.";
    if (!formData.time_limit || Number(formData.time_limit) <= 0)
      errors.time_limit = "Duration must be greater than 0.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        topic: parseInt(formData.topic),
        total_marks: parseInt(formData.total_marks) || 0,
        passing_marks: parseInt(formData.passing_marks) || 0,
        time_limit: parseInt(formData.time_limit),
        is_active: formData.is_active,
      };
      await createQuiz(payload);
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
        setError("Failed to create quiz. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (topicsLoading) return <Loading message="Loading topics..." />;

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
            <h1 className="form-page-title">Create Quiz</h1>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label htmlFor="title">Quiz Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Python Basics"
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
                  placeholder="What is this quiz about?"
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
                    placeholder="e.g. 10"
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
                    placeholder="e.g. 6"
                    value={formData.passing_marks}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time_limit">Duration (minutes) *</label>
                  <input
                    id="time_limit"
                    name="time_limit"
                    type="number"
                    min="1"
                    placeholder="e.g. 30"
                    value={formData.time_limit}
                    onChange={handleChange}
                  />
                  {fieldErrors.time_limit && (
                    <span className="field-error">{fieldErrors.time_limit}</span>
                  )}
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
