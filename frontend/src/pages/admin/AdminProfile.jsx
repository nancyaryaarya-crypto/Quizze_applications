import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getProfile } from "../../services/userService";
import { getQuizzes } from "../../services/quizService";
import { getTopics } from "../../services/topicService";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ quizzes: 0, topics: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, quizzes, topics] = await Promise.all([
          getProfile(),
          getQuizzes(),
          getTopics(),
        ]);
        setProfile(profileData);
        setStats({ quizzes: quizzes.length, topics: topics.length });
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
            <h1>Admin Profile</h1>
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
                <span className="role-badge role-admin">
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
                  <div className="profile-stat-value">{stats.quizzes}</div>
                  <div className="profile-stat-label">Quizzes Managed</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{stats.topics}</div>
                  <div className="profile-stat-label">Topics Managed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
