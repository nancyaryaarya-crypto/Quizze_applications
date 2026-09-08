import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { getAttempt } from "../../services/attemptService";

const QuizResult = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Use result passed via navigation state or fetch fresh
  const [result, setResult] = useState(location.state?.result?.result || null);
  const [loading, setLoading] = useState(!result);

  useEffect(() => {
    if (!result) {
      const fetchResult = async () => {
        try {
          const data = await getAttempt(attemptId);
          setResult(data);
        } catch {
          // handle error silently
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [attemptId, result]);

  if (loading) return <Loading message="Loading results..." />;

  const percentage =
    result && result.total_marks > 0
      ? Math.round((result.score / result.total_marks) * 100)
      : 0;

  const passed = result?.is_passed;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="result-page">
            <div className={`result-card ${passed ? "passed" : "failed"}`}>
              <div className="result-emoji">{passed ? "🎉" : "😔"}</div>
              <h1 className="result-title">Quiz Completed!</h1>

              <div className="result-score-circle">
                <div className="score-number">
                  {result?.score} / {result?.total_marks}
                </div>
                <div className="score-percent">{percentage}%</div>
              </div>

              <div className={`result-status-badge ${passed ? "passed" : "failed"}`}>
                {passed ? "✅ PASSED" : "❌ FAILED"}
              </div>

              <div className="result-meta">
                {result?.submitted_at && (
                  <span>
                    Submitted:{" "}
                    {new Date(result.submitted_at).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="result-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/student/dashboard")}
                >
                  🏠 Dashboard
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/student/quizzes")}
                >
                  📝 More Quizzes
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/student/attempts")}
                >
                  📊 View Attempts
                </button>
              </div>

              <div className="result-review-section" style={{ marginTop: '2rem', textAlign: 'left', width: '100%' }}>
                <h3 style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Attempt Review</h3>
                {result?.answers && result.answers.length > 0 ? (
                  <div className="answers-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {result.answers.map((ans, idx) => (
                      <div key={ans.id} className="answer-card" style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg)' }}>
                        <p style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.75rem' }}>Q{idx + 1}: {ans.question_text}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                          <div style={{ color: ans.is_correct ? 'var(--success)' : 'var(--danger)', fontWeight: '500' }}>
                            <span style={{ display: 'inline-block', width: '110px' }}>Your Answer:</span> 
                            {ans.selected_option_text} {ans.is_correct ? '✅' : '❌'}
                          </div>
                          {!ans.is_correct && (
                            <div style={{ color: 'var(--success)', fontWeight: '500' }}>
                              <span style={{ display: 'inline-block', width: '110px' }}>Correct Answer:</span> 
                              {ans.correct_option_text} ✅
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No answer details available for this attempt.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
