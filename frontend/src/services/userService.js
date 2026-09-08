import api from "./api";

/**
 * GET /api/accounts/profile/
 * Returns: { id, email, username, role, created_at }
 */
export const getProfile = async () => {
  const response = await api.get("accounts/profile/");
  return response.data;
};
