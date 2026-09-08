import api from "./api";

/**
 * GET /api/quizzes/
 * Returns: array of { id, title, description, topic, created_by, total_marks, duration, is_active }
 */
export const getQuizzes = async () => {
  const response = await api.get("quizzes/");
  return response.data;
};

/**
 * GET /api/quizzes/<id>/
 * Returns: { id, title, description, topic, duration, questions: [...] }
 */
export const getQuiz = async (id) => {
  const response = await api.get(`quizzes/${id}/`);
  return response.data;
};

/**
 * POST /api/quizzes/
 * Body: { title, description, topic (id), total_marks, passing_marks, time_limit, is_active }
 * Returns: created quiz object
 */
export const createQuiz = async (data) => {
  const response = await api.post("quizzes/", data);
  return response.data;
};

/**
 * PUT /api/quizzes/<id>/
 * Body: { title, description, topic (id), total_marks, passing_marks, time_limit, is_active }
 * Returns: updated quiz object
 */
export const updateQuiz = async (id, data) => {
  const response = await api.put(`quizzes/${id}/`, data);
  return response.data;
};

/**
 * DELETE /api/quizzes/<id>/
 * Returns: { message }
 */
export const deleteQuiz = async (id) => {
  const response = await api.delete(`quizzes/${id}/`);
  return response.data;
};

/**
 * GET /api/quizzes/<id>/questions/
 * Returns: array of questions for a quiz (Admin only)
 */
export const getQuizQuestions = async (quizId) => {
  const response = await api.get(`quizzes/${quizId}/questions/`);
  return response.data;
};

/**
 * POST /api/quizzes/<id>/questions/
 * Body: { question_text, marks, options: [{option_text, is_correct}] }
 */
export const addQuizQuestion = async (quizId, data) => {
  const response = await api.post(`quizzes/${quizId}/questions/`, data);
  return response.data;
};

/**
 * DELETE /api/quizzes/questions/<id>/
 */
export const deleteQuizQuestion = async (questionId) => {
  const response = await api.delete(`quizzes/questions/${questionId}/`);
  return response.data;
};
