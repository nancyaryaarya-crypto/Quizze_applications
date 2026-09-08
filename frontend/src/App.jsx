import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import StudentRoute from "./components/StudentRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import QuizList from "./pages/student/QuizList";
import QuizDetails from "./pages/student/QuizDetails";
import TakeQuiz from "./pages/student/TakeQuiz";
import QuizResult from "./pages/student/QuizResult";
import AttemptHistory from "./pages/student/AttemptHistory";
import Topics from "./pages/student/Topics";
import Profile from "./pages/student/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import CreateQuiz from "./pages/admin/CreateQuiz";
import EditQuiz from "./pages/admin/EditQuiz";
import ManageQuestions from "./pages/admin/ManageQuestions";
import ManageTopics from "./pages/admin/ManageTopics";
import CreateTopic from "./pages/admin/CreateTopic";
import EditTopic from "./pages/admin/EditTopic";

// Utility Pages
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Global styles
import "./styles/global.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ─── Student Routes ─────────────────────────────── */}
          <Route
            path="/student/dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />
          <Route
            path="/student/quizzes"
            element={
              <StudentRoute>
                <QuizList />
              </StudentRoute>
            }
          />
          <Route
            path="/student/quizzes/:id"
            element={
              <StudentRoute>
                <QuizDetails />
              </StudentRoute>
            }
          />
          <Route
            path="/student/quiz/:attemptId"
            element={
              <StudentRoute>
                <TakeQuiz />
              </StudentRoute>
            }
          />
          <Route
            path="/student/result/:attemptId"
            element={
              <StudentRoute>
                <QuizResult />
              </StudentRoute>
            }
          />
          <Route
            path="/student/attempts"
            element={
              <StudentRoute>
                <AttemptHistory />
              </StudentRoute>
            }
          />
          <Route
            path="/student/topics"
            element={
              <StudentRoute>
                <Topics />
              </StudentRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <StudentRoute>
                <Profile />
              </StudentRoute>
            }
          />

          {/* ─── Admin Routes ────────────────────────────────── */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes"
            element={
              <AdminRoute>
                <ManageQuizzes />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes/create"
            element={
              <AdminRoute>
                <CreateQuiz />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes/:id/edit"
            element={
              <AdminRoute>
                <EditQuiz />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes/:id/questions"
            element={
              <AdminRoute>
                <ManageQuestions />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/topics"
            element={
              <AdminRoute>
                <ManageTopics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/topics/create"
            element={
              <AdminRoute>
                <CreateTopic />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/topics/:id/edit"
            element={
              <AdminRoute>
                <EditTopic />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
