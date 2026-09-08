import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getQuizQuestions, addQuizQuestion, deleteQuizQuestion, getQuiz } from "../../services/quizService";

const ManageQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  
  // New Question State
  const [questionText, setQuestionText] = useState("");
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false }
  ]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const qz = await getQuiz(id);
      setQuiz(qz);
      const qs = await getQuizQuestions(id);
      setQuestions(qs);
    } catch (err) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    if (field === "is_correct" && value === true) {
      // Uncheck others
      newOptions.forEach((o) => (o.is_correct = false));
    }
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOptionField = () => {
    setOptions([...options, { option_text: "", is_correct: false }]);
  };
  
  const removeOptionField = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return alert("Question text is required.");
    if (options.length < 2) return alert("At least 2 options required.");
    if (!options.some(o => o.is_correct)) return alert("Mark at least one option as correct.");
    
    setAdding(true);
    try {
      await addQuizQuestion(id, {
        question_text: questionText,
        marks: parseInt(marks),
        options: options
      });
      // Reset form
      setQuestionText("");
      setMarks(1);
      setOptions([{ option_text: "", is_correct: false }, { option_text: "", is_correct: false }]);
      setShowAddForm(false);
      fetchData(); // Refresh list
    } catch (err) {
      alert("Failed to add question.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuizQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err) {
      alert("Failed to delete question.");
    }
  };

  if (loading) return <Loading message="Loading questions..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <button className="btn-back" onClick={() => navigate("/admin/quizzes")}>
            ← Back to Quizzes
          </button>

          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Manage Questions</h1>
              <p className="page-subtitle">Quiz: {quiz?.title}</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "+ Add Question"}
            </button>
          </div>

          <ErrorMessage message={error} />

          {showAddForm && (
            <div className="form-page-card" style={{ marginBottom: "2rem" }}>
              <h2>New Question</h2>
              <form onSubmit={handleAddQuestion} className="admin-form">
                <div className="form-group">
                  <label>Question Text *</label>
                  <textarea 
                    rows={2} 
                    value={questionText} 
                    onChange={e => setQuestionText(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Marks *</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={marks} 
                    onChange={e => setMarks(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Options</label>
                  {options.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                      <input 
                        type="radio" 
                        name="correct_option"
                        checked={opt.is_correct}
                        onChange={() => handleOptionChange(idx, "is_correct", true)}
                        title="Mark as correct"
                        style={{ width: "auto", cursor: "pointer", transform: "scale(1.2)" }}
                      />
                      <input 
                        type="text" 
                        value={opt.option_text}
                        onChange={(e) => handleOptionChange(idx, "option_text", e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        required
                        style={{ flex: 1, minWidth: "150px" }}
                      />
                      {options.length > 2 && (
                        <button type="button" className="btn btn-outline-sm" onClick={() => removeOptionField(idx)}>❌</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addOptionField}>
                    + Add Option
                  </button>
                </div>

                <button type="submit" className="btn btn-success" disabled={adding}>
                  {adding ? "Saving..." : "Save Question"}
                </button>
              </form>
            </div>
          )}

          <div className="questions-list">
            {questions.length === 0 && !showAddForm ? (
              <p>No questions added to this quiz yet.</p>
            ) : (
              questions.map((q, idx) => (
                <div key={q.id} className="section-card" style={{ marginBottom: '1rem', position: 'relative' }}>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="btn btn-outline-sm" 
                    style={{ position: 'absolute', right: '15px', top: '15px' }}
                  >
                    Delete
                  </button>
                  <h3>{idx + 1}. {q.question_text} <small>({q.marks} mark{q.marks > 1 ? 's' : ''})</small></h3>
                  <ul style={{ listStyleType: 'none', paddingLeft: '1rem', marginTop: '10px' }}>
                    {q.options.map((opt, oIdx) => (
                      <li key={oIdx} style={{ padding: '5px 0', color: opt.is_correct ? 'green' : 'inherit', fontWeight: opt.is_correct ? 'bold' : 'normal' }}>
                        {opt.is_correct ? "✅ " : "⚪ "} {opt.option_text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageQuestions;
