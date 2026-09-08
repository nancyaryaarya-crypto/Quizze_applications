import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Simple hook — use everywhere instead of useContext(AuthContext)
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default useAuth;
