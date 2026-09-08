import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getQuiz } from "../../services/quizService";
import { startQuiz } from "../../services/attemptService";

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(id);
        setQuiz(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Quiz not found.");
        } else {
          setError("Failed to load quiz details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleStart = async () => {
    setStarting(true);
    setError("");
    try {
      const data = await startQuiz(id);
      const attemptId = data.attempt.id;
      navigate(`/student/quiz/${attemptId}`, { state: { quiz } });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Could not start the quiz. Please try again.";
      setError(msg);
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <Loading message="Loading quiz details..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <button
            className="btn-back"
            onClick={() => navigate("/student/quizzes")}
          >
            ← Back to Quizzes
          </button>

          <ErrorMessage message={error} />

          {quiz && (
            <div className="quiz-detail-card">
              <div className="quiz-detail-header">
                <span className="quiz-topic-badge">{quiz.topic_name || quiz.topic}</span>
                <h1 className="quiz-detail-title">{quiz.title}</h1>
              </div>

              {quiz.description && (
                <p className="quiz-detail-desc">{quiz.description}</p>
              )}

              <div className="quiz-detail-meta">
                {quiz.questions && (
                  <div className="meta-item">
                    <span className="meta-icon">❓</span>
                    <div>
                      <div className="meta-value">{quiz.questions.length}</div>
                      <div className="meta-label">Questions</div>
                    </div>
                  </div>
                )}
                {quiz.time_limit > 0 && (
                  <div className="meta-item">
                    <span className="meta-icon">⏱</span>
                    <div>
                      <div className="meta-value">{quiz.time_limit}</div>
                      <div className="meta-label">Minutes</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="quiz-instructions">
                <h3>📋 Instructions</h3>
                <ul>
                  <li>Read each question carefully before answering.</li>
                  <li>You can navigate between questions freely.</li>
                  <li>Make sure to answer all questions before submitting.</li>
                  <li>Once submitted, you cannot change your answers.</li>
                  <li>Your score will be shown immediately after submission.</li>
                </ul>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleStart}
                disabled={starting}
              >
                {starting ? "Starting..." : "🚀 Start Quiz"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
