import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getProfile } from "../../services/userService";
import { getAttempts } from "../../services/attemptService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ completed: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, attemptsData] = await Promise.all([
          getProfile(),
          getAttempts(),
        ]);
        setProfile(profileData);

        const completed = attemptsData.filter((a) => a.completed);
        const avg =
          completed.length > 0
            ? Math.round(
                completed.reduce((sum, a) => {
                  return (
                    sum +
                    (a.total_marks > 0 ? (a.score / a.total_marks) * 100 : 0)
                  );
                }, 0) / completed.length
              )
            : 0;
        setStats({ completed: completed.length, avgScore: avg });
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1>My Profile</h1>
          </div>

          <ErrorMessage message={error} />

          {profile && (
            <div className="profile-card">
              <div className="profile-avatar">
                {profile.username?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h2>{profile.username}</h2>
                <p className="profile-email">{profile.email}</p>
                <span className="role-badge role-student">
                  {profile.role}
                </span>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="profile-stat-value">{stats.completed}</div>
                  <div className="profile-stat-label">Quizzes Completed</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{stats.avgScore}%</div>
                  <div className="profile-stat-label">Average Score</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
