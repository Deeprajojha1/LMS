import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  return (
    <div className="profile-page">
      {/* Top Bar */}
      <div className="profile-topbar">
        <button className="back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft size={16} />
          <span>Back</span>
        </button>

        <h2 className="top-title">My Profile</h2>
      </div>

      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            {/* Avatar */}
            <div className="avatar-wrap">
              {userData?.photoUrl ? (
                <img className="avatar-img" src={userData?.photoUrl} alt="profile" />
              ) : (
                <div className="avatar-fallback">
                  {userData?.name?.slice(0, 1)?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Name & Role */}
            <div className="profile-title">
              <h1 className="profile-name">{userData?.name || "User"}</h1>
              <p className="profile-role">{userData?.role || "Student"}</p>
            </div>

            {/* Button */}
            <div className="profile-actions">
              <button className="edit-btn" onClick={()=>{navigate('/edit_profile')}}>Edit Profile</button>
            </div>
          </div>

          {/* Info Section */}
          <div className="profile-info">
            <div className="info-item">
              <p className="info-label">Email</p>
              <p className="info-value">{userData?.email || "-"}</p>
            </div>

            <div className="info-item">
              <p className="info-label">Bio</p>
              <p className="info-value bio-text">
                {userData?.description || "No bio added yet."}
              </p>
            </div>

            <div className="info-item">
              <p className="info-label">Enrolled Courses</p>
              <p className="info-value">
                {userData?.enrolledCourses?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Stats / Extra Card */}
        <div className="stats-card">
          <h3 className="stats-title">Quick Summary</h3>

          <div className="stats-grid">
            <div className="stat-box">
              <p className="stat-num">{userData?.enrolledCourses?.length || 0}</p>
              <p className="stat-text">Courses</p>
            </div>

            <div className="stat-box">
              <p className="stat-num">{userData?.role || "Student"}</p>
              <p className="stat-text">Role</p>
            </div>

            <div className="stat-box">
              <p className="stat-num">Active</p>
              <p className="stat-text">Status</p>
            </div>
          </div>

          <div className="tip-box">
            <p className="tip-title">✨ Pro Tip</p>
            <p className="tip-text">
              Add a strong bio + profile photo to look more professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
