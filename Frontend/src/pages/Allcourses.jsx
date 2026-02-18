import React, { useEffect, useState } from "react";
import "./Allcourses.css";
import { FaArrowLeftLong } from "react-icons/fa6";
import Nav from "../components/Navbar/Nav";
import { useNavigate } from "react-router-dom";
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
    const { courses } = useSelector((state) => state.course);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);

    const handleCategoryChange = (category) => {
        setSelectedCategory((prev) => (prev === category ? "" : category));
    };

    useEffect(() => {
        let published = courses?.filter((c) => c.isPublished) || [];

        if (selectedCategory) {
            published = published.filter(
                (course) => course.category === selectedCategory
            );
        }

        setFilteredCourses(published);
    }, [courses, selectedCategory]);

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

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleViewCourse = (course) => {
        navigate("/view-courses", { state: { course } });
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

                    <button className="ai-btn">
                        Search with AI
                        <FcSearch />
                    </button>

                    <div className="filters-list">
                        {categories.map((cat) => (
                            <label key={cat} className="filter-item">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    checked={selectedCategory === cat}
                                    onChange={() => handleCategoryChange(cat)}
                                />
                                {cat}
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
                            <p>
                                Explore premium learning experiences designed to accelerate
                                your career.
                            </p>
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
                            filteredCourses.map((course) => (
                                <div
                                    className="course-card"
                                    key={course._id}
                                    onClick={() => handleViewCourse(course)}
                                >
                                    <div className="card-thumb">
                                        <img src={course.thumnail} alt={course.title} />
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
                                        </div>
                                    </div>
                                </div>
                            ))}
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

            {isMobile && isSidebarOpen && (
                <div className="filters-overlay" onClick={toggleSidebar}></div>
            )}
        </>
    );
};

export default Allcourses;
