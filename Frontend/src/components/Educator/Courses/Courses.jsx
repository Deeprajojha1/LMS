import React from "react";
import { FaArrowLeftLong, FaArrowUpRightDots } from "react-icons/fa6";
import { MdCurrencyRupee } from "react-icons/md";
import { SiStatuspal } from "react-icons/si";
import { SlActionRedo } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import "./Courses.css";
import { useSelector } from "react-redux";
import { useGetCreatorCourse } from "../../customHooks/getCreatorCourse.js";


const Courses = () => {
  const navigate = useNavigate();
  
  // Fetch creator courses
  useGetCreatorCourse();

  //  Courses from Redux Slice
  const { courses } = useSelector((state) => state.course);
  console.log(courses);
  return (
    <div className="coursesMainContainer">
      <div className="coursesWrapper">
        {/*  Header */}
        <div className="coursesTopHeader">
          <div className="coursesHeaderLeft">
            <div className="backIconBox">
              <FaArrowLeftLong
                className="backIcon"
                onClick={() => navigate("/dashboard")}
              />
            </div>
            <h1 className="coursesHeading">All Created Courses</h1>
          </div>

          <div className="coursesHeaderRight">
            <button
              className="createCourseBtn"
              onClick={() => navigate("/create-course")}
            >
              + Create Course
            </button>
          </div>
        </div>

        {/*  Desktop Table */}
        <div className="desktopTableContainer">
          <table className="desktopTable">
            <thead className="desktopTableHead">
              <tr className="desktopHeadRow">
                <th className="desktopHeadCell">Courses</th>
                <th className="desktopHeadCell">Price</th>
                <th className="desktopHeadCell">Status</th>
                <th className="desktopHeadCell">Action</th>
              </tr>
            </thead>

            <tbody className="desktopTableBody">
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <tr className="desktopRow" key={course._id}>
                    {/*  Course Title + Thumbnail */}
                    <td className="desktopCell">
                      <div className="courseNameBox">
                        <div className="courseIconBox">
                          {course?.thumnail ? (
                            <img
                              src={course.thumnail}
                              alt={course.title}
                              className="courseThumbnail"
                            />
                          ) : (
                            <FaArrowUpRightDots className="courseIcon" />
                          )}
                        </div>

                        <div className="courseTextBox">
                          <p className="courseName">{course.title}</p>
                          {/* <p className="courseDuration">
                            {course?.duration || "N/A"}
                          </p> */}
                        </div>
                      </div>
                    </td>

                    {/*  Price */}
                    <td className="desktopCell">
                      <div className="priceBox">
                        <MdCurrencyRupee className="rupeeIcon" />
                        <span className="coursePrice">
                          {course?.price || "0 Free"}
                        </span>
                      </div>
                    </td>

                    {/*  Status */}
                    <td className="desktopCell">
                      <div className="statusBox">
                        <SiStatuspal className="statusIcon" />
                        <span
                          className={
                            course?.status === "Active"
                              ? "statusBadge active"
                              : "statusBadge inactive"
                          }
                        >
                          {console.log(course.isPublished)}
                          {course?.isPublished?"Published": "Draft"}
                        </span>
                      </div>
                    </td>

                    {/*  Action */}
                    <td className="desktopCell">
                      <div className="actionBox">
                        <button
                          className="viewBtn"
                          onClick={() => navigate(`/course/${course._id}`)}
                        >
                          View
                        </button>

                        <button
                          className="editBtn"
                          onClick={() => navigate(`/edit-course/${course._id}`)}
                        >
                          <SlActionRedo className="editIcon" />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="desktopRow">
                  <td
                    className="desktopCell"
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      fontWeight: "700",
                      padding: "18px",
                    }}
                  >
                    No Courses Found ❌
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*  Mobile Table */}
        <div className="mobileTableContainer">
          <table className="mobileTable">
            <tbody className="mobileTableBody">
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <tr className="mobileRow" key={course._id}>
                    <td className="mobileCell">
                      <div className="mobileCourseCard">
                        {/* Top */}
                        <div className="mobileTop">
                          <div className="mobileTitleBox">
                            <div className="courseIconBox">
                              {course.thumnail ? (
                                <img
                                  src={course.thumnail}
                                  alt={course.title}
                                  className="courseThumbnail"
                                />
                              ) : (
                                <FaArrowUpRightDots className="courseIcon" />
                              )}
                            </div>

                            <p className="mobileCourseName">{course.title}</p>
                          </div>

                          <span
                            className={
                              course.status === "Active"
                                ? "statusBadge active"
                                : "statusBadge inactive"
                            }
                          >
                            {course?.isPublished?"Published": "Draft"}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="mobileInfo">
                          <div className="mobileInfoRow">
                            <span className="mobileLabel">Price</span>
                            <span className="mobileValue">
                              <MdCurrencyRupee className="rupeeIcon" />
                              {course?.price || "0 Free"}
                            </span>
                          </div>

                          <div className="mobileInfoRow">
                            {/* <span className="mobileLabel">Duration</span>
                            <span className="mobileValue">
                              {course?.duration || "N/A"}
                            </span> */}
                          </div>
                        </div>

                        {/*  Actions */}
                        <div className="mobileActions">
                          <button
                            className="viewBtn"
                            onClick={() => navigate(`/course/${course._id}`)}
                          >
                            View
                          </button>

                          <button
                            className="editBtn"
                            onClick={() => navigate(`/edit-course/${course._id}`)}
                          >
                            <SlActionRedo className="editIcon" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="mobileRow">
                  <td
                    className="mobileCell"
                    style={{
                      textAlign: "center",
                      fontWeight: "700",
                      padding: "18px",
                    }}
                  >
                    No Courses Found ❌
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Courses;
