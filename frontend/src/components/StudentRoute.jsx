import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

// Only allows STUDENT users — redirects others to /unauthorized
const StudentRoute = ({ children }) => {
  const { isAuthenticated, isStudent, loading } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStudent) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default StudentRoute;
