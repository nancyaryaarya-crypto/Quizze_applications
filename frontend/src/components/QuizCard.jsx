import React from "react";
import { useNavigate } from "react-router-dom";

// Quiz card used in the student quiz list
const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();
  const questionCount = quiz.questions ? quiz.questions.length : null;

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <span className="quiz-topic-badge">{quiz.topic_name || quiz.topic}</span>
        {quiz.is_active !== undefined && (
          <span className={`status-badge ${quiz.is_active ? "active" : "inactive"}`}>
            {quiz.is_active ? "Active" : "Inactive"}
          </span>
        )}
      </div>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      {quiz.description && (
        <p className="quiz-card-desc">{quiz.description}</p>
      )}
      <div className="quiz-card-meta">
        {quiz.total_marks > 0 && (
          <span>🏆 {quiz.total_marks} marks</span>
        )}
        {quiz.time_limit > 0 && (
          <span>⏱ {quiz.time_limit} min</span>
        )}
        {questionCount !== null && (
          <span>❓ {questionCount} questions</span>
        )}
      </div>
      <button
        className="btn btn-primary btn-full"
        onClick={() => navigate(`/student/quizzes/${quiz.id}`)}
      >
        View Quiz
      </button>
    </div>
  );
};

export default QuizCard;
