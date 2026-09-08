import api from "./api";

/**
 * POST /api/attempts/start/<quiz_id>/
 * Returns: { message, attempt: { id, student, quiz, score, ... } }
 */
export const startQuiz = async (quizId) => {
  const response = await api.post(`attempts/start/${quizId}/`);
  return response.data;
};

/**
 * POST /api/attempts/submit/<attempt_id>/
 * Body: { answers: [{ question: <id>, option: <id> }, ...] }
 * Returns: { message, score, result: { id, score, total_marks, is_passed, ... } }
 */
export const submitQuiz = async (attemptId, answers) => {
  const response = await api.post(`attempts/submit/${attemptId}/`, { answers });
  return response.data;
};

/**
 * GET /api/attempts/
 * Returns: array of attempt objects for current student
 */
export const getAttempts = async () => {
  const response = await api.get("attempts/");
  return response.data;
};

/**
 * GET /api/attempts/<id>/
 * Returns: single attempt object with answers
 */
export const getAttempt = async (id) => {
  const response = await api.get(`attempts/${id}/`);
  return response.data;
};
