import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const studentLinks = [
    { path: "/student/dashboard", label: "🏠 Dashboard" },
    { path: "/student/quizzes", label: "📝 Quizzes" },
    { path: "/student/topics", label: "📚 Topics" },
    { path: "/student/attempts", label: "📊 My Attempts" },
    { path: "/student/profile", label: "👤 Profile" },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "🏠 Dashboard" },
    { path: "/admin/quizzes", label: "📝 Manage Quizzes" },
    { path: "/admin/topics", label: "📚 Manage Topics" },
    { path: "/admin/profile", label: "👤 Profile" },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🎯 QuizMaster</div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        🚪 Logout
      </button>
    </aside>
  );
};

export default Sidebar;
