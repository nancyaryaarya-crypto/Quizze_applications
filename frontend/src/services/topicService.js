import api from "./api";

/**
 * GET /api/topics/
 * Returns: array of { id, name, description, created_by, is_active, created_at, updated_at }
 */
export const getTopics = async () => {
  const response = await api.get("topics/");
  return response.data;
};

/**
 * GET /api/topics/<id>/
 * Returns: { id, name, description, created_by, is_active, created_at, updated_at }
 */
export const getTopic = async (id) => {
  const response = await api.get(`topics/${id}/`);
  return response.data;
};

/**
 * POST /api/topics/
 * Body: { name, description }
 * Returns: created topic object
 */
export const createTopic = async (data) => {
  const response = await api.post("topics/", data);
  return response.data;
};

/**
 * PUT /api/topics/<id>/
 * Body: { name, description }
 * Returns: updated topic object
 */
export const updateTopic = async (id, data) => {
  const response = await api.put(`topics/${id}/`, data);
  return response.data;
};

/**
 * DELETE /api/topics/<id>/
 * Returns: { message }
 */
export const deleteTopic = async (id) => {
  const response = await api.delete(`topics/${id}/`);
  return response.data;
};
