import React, { createContext, useState, useEffect, useCallback } from "react";
import { login as loginService, register as registerService } from "../services/authService";
import { getProfile } from "../services/userService";
import { setTokens, clearTokens, setUser, getUser, getAccessToken } from "../utils/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  // On mount — verify stored token and fetch fresh profile
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const profile = await getProfile();
          setCurrentUser(profile);
          setUser(profile);
        } catch {
          // Token invalid or expired beyond refresh — clear everything
          clearTokens();
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // ── Login ──────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await loginService(email, password);
    setTokens(data.access, data.refresh);

    // Fetch real profile so we have role, username, etc.
    const profile = await getProfile();
    setCurrentUser(profile);
    setUser(profile);

    return profile;
  }, []);

  // ── Register ───────────────────────────────────────────
  const register = useCallback(async (email, username, password, password2, role) => {
    const data = await registerService(email, username, password, password2, role);
    return data;
  }, []);

  // ── Logout ─────────────────────────────────────────────
  const logout = useCallback(() => {
    clearTokens();
    setCurrentUser(null);
  }, []);

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === "ADMIN";
  const isStudent = currentUser?.role === "STUDENT";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
