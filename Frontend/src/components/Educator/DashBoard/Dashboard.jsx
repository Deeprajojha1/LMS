import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import "./Dashboard.css";

const Dashboard = () => {
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const firstLetter = userData?.name?.slice(0, 1)?.toUpperCase() || "E";

  return (
    <div className="dashboardPage">
      <div className="dashboardShell">
        <div className="dashboardHeroCard">
          <button className="dashboardBackBtn" onClick={() => navigate("/")}>
            <FaArrowLeftLong />
          </button>

          <div className="dashboardProfileMedia">
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="profile"
                className="dashboardAvatarImage"
              />
            ) : (
              <div className="dashboardAvatarFallback">{firstLetter}</div>
            )}
          </div>

          <div className="dashboardHeroContent">
            <p className="dashboardRoleTag">Educator Space</p>
            <h1>Welcome, {userData?.name || "Educator"}</h1>

            <div className="dashboardStats">
              <div className="dashboardStatCard">
                <p>Total Earnings</p>
                <h2>Rs. 0</h2>
              </div>
              <div className="dashboardStatCard">
                <p>Courses</p>
                <h2>0</h2>
              </div>
            </div>

            <p className="dashboardDescription">
              {userData?.description || "No description added yet."}
            </p>

            <button
              className="dashboardPrimaryBtn"
              onClick={() => navigate("/courses")}
            >
              Manage Courses
            </button>
          </div>
        </div>

        <div className="dashboardChartCard">
          <h3>Analytics</h3>
          <p>Course insights and revenue charts will appear here.</p>
          <div className="dashboardChartPlaceholder"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
