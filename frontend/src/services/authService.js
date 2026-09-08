import api from "./api";

/**
 * POST /api/accounts/login/
 * Body: { email, password }
 * Returns: { access, refresh }
 */
export const login = async (email, password) => {
  const response = await api.post("accounts/login/", { email, password });
  return response.data;
};

/**
 * POST /api/accounts/register/
 * Body: { email, username, password, password2, role }
 * Returns: { message, data }
 */
export const register = async (email, username, password, password2, role = "STUDENT") => {
  const response = await api.post("accounts/register/", {
    email,
    username,
    password,
    password2,
    role,
  });
  return response.data;
};

/**
 * POST /api/accounts/refresh/
 * Body: { refresh }
 * Returns: { access }
 */
export const refreshToken = async (refresh) => {
  const response = await api.post("accounts/refresh/", { refresh });
  return response.data;
};
