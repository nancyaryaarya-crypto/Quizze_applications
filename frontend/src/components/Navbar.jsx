import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAdmin ? "/admin/dashboard" : "/student/dashboard"}>
          🎯 QuizMaster
        </Link>
      </div>

      {/* Hamburger for mobile */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/admin/quizzes" onClick={() => setMenuOpen(false)}>Quizzes</Link>
            <Link to="/admin/topics" onClick={() => setMenuOpen(false)}>Topics</Link>
          </>
        ) : (
          <>
            <Link to="/student/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/student/quizzes" onClick={() => setMenuOpen(false)}>Quizzes</Link>
            <Link to="/student/topics" onClick={() => setMenuOpen(false)}>Topics</Link>
          </>
        )}

        <div className="navbar-user">
          <Link to={isAdmin ? "/admin/profile" : "/student/profile"} className="navbar-username" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ marginRight: '8px' }}>👤</span>
            {currentUser?.username}
          </Link>
          <button className="btn btn-outline-sm logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
