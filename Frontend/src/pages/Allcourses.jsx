import React, { useEffect, useMemo, useState } from "react";
import "./Allcourses.css";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import Nav from "../components/Navbar/Nav";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FcSearch } from "react-icons/fc";
import { useSelector } from "react-redux";

const categories = [
  "App Development",
  "AI Tools",
  "Web Development",
  "Data Science",
  "Data Analytics",
  "Ethical Hacking",
  "AI/ML",
  "UI/UX Designing",
  "Others",
];

const Allcourses = () => {
  const navigate = useNavigate();
  const { courseData, courses } = useSelector((state) => state.course);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const filteredCourses = useMemo(() => {
    const source = (courseData?.length ? courseData : courses) || [];
    let published = source.filter((course) => course?.isPublished);

    if (selectedCategory) {
      published = published.filter((course) => course.category === selectedCategory);
    }

    const query = searchTerm.trim().toLowerCase();
    if (query) {
      published = published.filter((course) => {
        const title = String(course?.title || "").toLowerCase();
        const subtitle = String(course?.subTitle || "").toLowerCase();
        const category = String(course?.category || "").toLowerCase();
        const description = String(course?.description || "").toLowerCase();
        return [title, subtitle, category, description].some((field) => field.includes(query));
      });
    }

    return published;
  }, [courseData, courses, selectedCategory, searchTerm]);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 900;
      setIsMobile(mobileView);

      if (!mobileView) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleViewCourse = (course) => {
    if (!course?._id) return;
    navigate(`/view-courses/${course._id}`);
  };

  return (
    <>
      <Nav />

      <div className="allcourses-page">
        <aside className={`filters ${isSidebarOpen ? "open" : ""}`}>
          <div className="filters-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeftLong />
            </button>

            <div>
              <h2>Filter by Category</h2>
              <p>Refine courses instantly</p>
            </div>
          </div>

          <button className="ai-btn" onClick={()=>navigate('/search-with-ai')}>
            Search with AI
            <FcSearch />
          </button>

          <div className="filters-list">
            {categories.map((category) => (
              <label key={category} className="filter-item">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>

          <button className="reset-btn" onClick={() => setSelectedCategory("")}>
            Reset Filters
          </button>
        </aside>

        <main className="courses">
          <div className="courses-header">
            <div>
              <h1>All Courses</h1>
              <p>Explore premium learning experiences designed to accelerate your career.</p>
              <div className="course-search-box">
                <FcSearch />
                <input
                  type="text"
                  placeholder="Search courses by title, category, topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {isMobile && (
                <button className="filters-toggle-btn" onClick={toggleSidebar}>
                  {isSidebarOpen ? "Close Filters" : "Open Filters"}
                </button>
              )}
            </div>

            <span className="courses-count">{filteredCourses.length} Courses</span>
          </div>

          <div className="courses-grid">
            {filteredCourses.length > 0 &&
              filteredCourses.map((course) => {
                const ratingValue = Number(course?.averageRating || 0);
                const reviewCount = Number(course?.reviewCount || 0);

                return (
                  <div
                    className="course-card"
                    key={course._id}
                    onClick={() => handleViewCourse(course)}
                  >
                    <div className="card-thumb">
                      <img src={course?.thumnail || course?.thumbnail} alt={course.title} />
                    </div>

                    <div className="card-body">
                      <div className="card-meta">
                        <span className="chip">{course.category}</span>
                        <span className="level">{course.level}</span>
                      </div>

                      <h3>{course.title}</h3>
                      <p>{course.subTitle}</p>

                      <div className="card-footer">
                        <span className="price">Rs. {course.price}</span>
                        <div className="rating-wrap">
                          <span className="rating-badge">
                            <FaStar />
                            {reviewCount ? ratingValue.toFixed(1) : "0.0"}
                          </span>
                          <span className="rating-text">
                            {reviewCount ? `${reviewCount} reviews` : "No reviews"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="empty-state">
              <h3>No Courses Found</h3>
              <p>Try another category or reset filters.</p>
              <button onClick={() => setSelectedCategory("")}>Reset Filters</button>
            </div>
          )}
        </main>
      </div>

      {isMobile && isSidebarOpen && <div className="filters-overlay" onClick={toggleSidebar} />}
    </>
  );
};

export default Allcourses;
