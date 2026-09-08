import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";
import ProgressBar from "../../components/ProgressBar";
import { getQuiz } from "../../services/quizService";
import { getAttempt, submitQuiz } from "../../services/attemptService";

const TakeQuiz = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  
  useEffect(() => {
    const init = async () => {
      try {
        const attemptData = await getAttempt(attemptId);
        setAttempt(attemptData);
        const quizData = await getQuiz(attemptData.quiz);
        setQuiz(quizData);
      } catch {
        setError("Failed to load quiz. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [attemptId]);

  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitConfirmed = useCallback(async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setError("");

   
    const answersPayload = Object.entries(answers).map(([questionId, optionId]) => ({
      question: parseInt(questionId),
      option: parseInt(optionId),
    }));

    try {
      const result = await submitQuiz(parseInt(attemptId), answersPayload);
      navigate(`/student/result/${attemptId}`, { state: { result } });
    } catch (err) {
      const msg =
        err.response?.data?.error || "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [answers, attemptId, navigate]);

  if (loading) return <Loading message="Loading quiz..." />;
  if (error && !quiz) {
    return (
      <div className="page-content" style={{ padding: "2rem" }}>
        <ErrorMessage message={error} />
        <button className="btn btn-secondary" onClick={() => navigate("/student/quizzes")}>
          ← Back to Quizzes
        </button>
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="takequiz-page">
      <Navbar />
      <div className="takequiz-content">
        {/* Header */}
        <div className="takequiz-header">
          <h2>{quiz?.title}</h2>
          <span className="question-counter">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <ProgressBar
          current={answeredCount}
          total={questions.length}
          label={`${answeredCount} / ${questions.length} answered`}
        />

        {/* Question Navigator */}
        <div className="question-navigator">
          {questions.map((q, i) => (
            <span
              key={q.id}
              className={`nav-bubble ${i === currentIndex ? "current" : ""} ${
                answers[q.id] !== undefined ? "answered" : "unanswered"
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>

        <ErrorMessage message={error} />

        {/* Question Card */}
        {currentQuestion && (
          <div className="question-card">
            <div className="question-marks-badge">
              {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? "s" : ""}
            </div>
            <h3 className="question-text">{currentQuestion.question_text}</h3>

            <div className="options-list">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className={`option-item ${
                    answers[currentQuestion.id] === option.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() =>
                      handleSelectAnswer(currentQuestion.id, option.id)
                    }
                  />
                  <span>{option.option_text}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="quiz-navigation">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => setShowConfirm(true)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz ✓"}
            </button>
          )}
        </div>

        
        {questions.length > 1 && (
          <div className="submit-area">
            {/* <button
              className="btn btn-success btn-lg"
              onClick={() => setShowConfirm(true)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "🏁 Submit Quiz"}
            </button> */}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Submit Quiz?"
      >
        <div className="confirm-modal-body">
          <p>
            You have answered{" "}
            <strong>{answeredCount}</strong> of{" "}
            <strong>{questions.length}</strong> questions.
          </p>
          {answeredCount < questions.length && (
            <p className="confirm-warning">
              ⚠️ {questions.length - answeredCount} question
              {questions.length - answeredCount !== 1 ? "s" : ""} unanswered.
            </p>
          )}
          <p>Are you sure you want to submit?</p>
          <div className="confirm-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSubmitConfirmed}
            >
              Yes, Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TakeQuiz;
