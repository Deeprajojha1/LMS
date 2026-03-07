import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import "./Dashboard.css";

const Dashboard = () => {
  const userData = useSelector((state) => state.user.userData);
  const { courses } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const firstLetter = userData?.name?.slice(0, 1)?.toUpperCase() || "E";

  const analytics = useMemo(() => {
    const createdCourses = courses || [];
    const totalCourses = createdCourses.length;
    const publishedCourses = createdCourses.filter((course) => course?.isPublished).length;
    const totalLectures = createdCourses.reduce(
      (acc, course) => acc + (course?.lectures?.length || 0),
      0
    );
    const totalEnrollments = createdCourses.reduce((acc, course) => {
      const list = course?.enroledStudents || course?.enrollStudents || [];
      return acc + list.length;
    }, 0);

    const totalEarnings = createdCourses.reduce((acc, course) => {
      const list = course?.enroledStudents || course?.enrollStudents || [];
      const price = Number(course?.price || 0);
      return acc + (Number.isNaN(price) ? 0 : price * list.length);
    }, 0);

    const lecturesByCourse = createdCourses
      .map((course) => ({
        id: course?._id,
        title: course?.title || "Untitled",
        value: course?.lectures?.length || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const enrollmentsByCourse = createdCourses
      .map((course) => ({
        id: course?._id,
        title: course?.title || "Untitled",
        value: (course?.enroledStudents || course?.enrollStudents || []).length,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const maxLectureValue = Math.max(...lecturesByCourse.map((item) => item.value), 1);
    const maxEnrollmentValue = Math.max(...enrollmentsByCourse.map((item) => item.value), 1);

    return {
      totalCourses,
      publishedCourses,
      draftCourses: totalCourses - publishedCourses,
      totalLectures,
      totalEnrollments,
      totalEarnings,
      lecturesByCourse,
      enrollmentsByCourse,
      maxLectureValue,
      maxEnrollmentValue,
    };
  }, [courses]);

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const shortTitle = (text) => (text.length > 18 ? `${text.slice(0, 18)}...` : text);

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
                <h2>{formatCurrency(analytics.totalEarnings)}</h2>
              </div>
              <div className="dashboardStatCard">
                <p>Courses</p>
                <h2>{analytics.totalCourses}</h2>
              </div>
              <div className="dashboardStatCard">
                <p>Total Lectures</p>
                <h2>{analytics.totalLectures}</h2>
              </div>
              <div className="dashboardStatCard">
                <p>Total Enrollments</p>
                <h2>{analytics.totalEnrollments}</h2>
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

        <div className="dashboardAnalyticsGrid">
          <div className="dashboardChartCard">
            <h3>Course Status</h3>
            <p>Published vs draft distribution.</p>
            <div className="dashboardStatusGrid">
              <div className="dashboardStatusPill">
                <span>Published</span>
                <b>{analytics.publishedCourses}</b>
              </div>
              <div className="dashboardStatusPill draft">
                <span>Draft</span>
                <b>{analytics.draftCourses}</b>
              </div>
            </div>
          </div>

          <div className="dashboardChartCard">
            <h3>Lectures Per Course</h3>
            <p>Top courses by lecture count.</p>
            <div className="dashboardBarList">
              {analytics.lecturesByCourse.length ? (
                analytics.lecturesByCourse.map((item) => (
                  <div className="dashboardBarRow" key={item.id}>
                    <div className="dashboardBarLabel">
                      <span>{shortTitle(item.title)}</span>
                      <b>{item.value}</b>
                    </div>
                    <div className="dashboardBarTrack">
                      <div
                        className="dashboardBarFill"
                        style={{ width: `${(item.value / analytics.maxLectureValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="dashboardEmptyText">No course data yet.</p>
              )}
            </div>
          </div>

          <div className="dashboardChartCard">
            <h3>Enrollments Per Course</h3>
            <p>Most enrolled courses.</p>
            <div className="dashboardBarList">
              {analytics.enrollmentsByCourse.length ? (
                analytics.enrollmentsByCourse.map((item) => (
                  <div className="dashboardBarRow" key={item.id}>
                    <div className="dashboardBarLabel">
                      <span>{shortTitle(item.title)}</span>
                      <b>{item.value}</b>
                    </div>
                    <div className="dashboardBarTrack">
                      <div
                        className="dashboardBarFill enroll"
                        style={{ width: `${(item.value / analytics.maxEnrollmentValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="dashboardEmptyText">No enrollments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
