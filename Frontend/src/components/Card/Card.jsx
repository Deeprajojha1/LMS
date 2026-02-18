import React, { useEffect, useState } from "react";
import "./Card.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const { courses } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    setPopularCourses(courses ? courses.filter((course) => course.isPublished) : []);
  }, [courses]);

  const handlePopularCardClick = () => {
    navigate(userData ? "/view-courses" : "/login");
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
            <div className="courseCard" key={each._id} onClick={handlePopularCardClick}>
              <div className="courseThumbWrap">
                <img src={each.thumnail} alt={each.title} className="courseThumb" />
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {popularCourses.length === 0 && (
          <p className="emptyText">No popular courses found</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
