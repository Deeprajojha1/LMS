import React, { useMemo } from "react";
import "./Card.css";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const { courseData, courses } = useSelector((state) => state.course);
  const popularCourses = useMemo(() => {
    const source = (courseData?.length ? courseData : courses) || [];
    return source.filter((course) => course.isPublished);
  }, [courseData, courses]);

  const handlePopularCardClick = (courseId) => {
    if (!userData) {
      navigate("/login");
      return;
    }

    if (!courseId) {
      return;
    }

    navigate(`/view-courses/${courseId}`);
  };

  return (
    <div className="popularPage">
      <div className="popularContainer">
        <div className="popularHeader">
          <h1 className="popularTitle">Our Popular Courses</h1>
          <p className="popularSubtitle">
            ExExplore top-rated courses designed to sharpen your skills and boost
            your confidence. Learn in-demand technologies in Tech, AI, and Business
            with practical, real-world projects. Upgrade your career faster with
            expert-led learning and industry-ready guidance.plore top-rated courses
            designed to boost your skills, enhance careers and unlock opportunities
            in Tech, AI, Business and beyond.
          </p>
        </div>

        <div className="popularGrid">
          {popularCourses.map((each) => (
            <div
              className="courseCard"
              key={each._id}
              onClick={() => handlePopularCardClick(each._id)}
            >
              <div className="courseThumbWrap">
                <img
                  src={each?.thumnail || each?.thumbnail}
                  alt={each.title}
                  className="courseThumb"
                />
              </div>

              <div className="courseBody">
                <div className="courseMetaRow">
                  <span className="courseCategory">{each.category}</span>
                  <span className="courseLevel">{each.level}</span>
                </div>
                <div className="content">
                  <h2 className="courseName">{each.title}</h2>
                  <p className="courseDesc">{each.subTitle}</p>
                </div>
                <div className="courseFooter">
                  <p className="coursePrice">Rs. {each.price}</p>
                  <div className="courseRatingWrap">
                    <span className="courseRatingBadge">
                      <FaStar />
                      {Number(each?.reviewCount || 0) ? Number(each?.averageRating || 0).toFixed(1) : "0.0"}
                    </span>
                    <span className="courseRatingText">
                      {Number(each?.reviewCount || 0) ? `${Number(each.reviewCount)} reviews` : "No reviews"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {popularCourses.length === 0 && (
          <p className="emptyText">{courseData || courses ? "No popular courses found" : "Loading courses..."}</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
