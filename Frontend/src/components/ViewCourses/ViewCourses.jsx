import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaPlay } from "react-icons/fa6";
import { MdOndemandVideo, MdOutlineAccessTime, MdOutlineWorkspacePremium } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../../redux/courseSlice";
import "./ViewCourses.css";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

const ViewCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewLecture, setPreviewLecture] = useState(null);
  const { courseId } = useParams();
  const { courseData, selectedCourse, courses } = useSelector((state) => state.course);

  const courseFromPublished = useMemo(() => {
    if (!courseData) return null;
    return courseData.find((item) => item?._id === courseId);
  }, [courseData, courseId]);

  const courseFromCreator = useMemo(() => {
    if (!courses) return null;
    return courses.find((item) => item?._id === courseId);
  }, [courses, courseId]);

  const course = courseFromPublished || courseFromCreator || selectedCourse;
  const lectures = course?.lectures || [];

  useEffect(() => {
    if (course) {
      dispatch(setSelectedCourse(course));
    }
  }, [course, courseId, dispatch]);

  const courseThumb = course?.thumbnail || course?.thumnail || FALLBACK_THUMB;

  const learningPoints = useMemo(() => {
    if (course?.description) {
      return course.description
        .split(".")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4);
    }
    return [
      "Learn core fundamentals step-by-step",
      "Build real-world projects and assignments",
      "Get mentor-style guidance and resources",
      "Prepare for interviews with curated practice",
    ];
  }, [course]);

  const audience = [
    "Beginners who are starting their journey",
    "Working professionals upskilling in tech",
    "Students preparing for internships",
    "Career switchers who need structured guidance",
  ];

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Rs. 0";
    }
    const numeric = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numeric)) {
      return `Rs. ${value}`;
    }
    return `Rs. ${numeric.toLocaleString("en-IN")}`;
  };

  const buildVideoUrl = (rawUrl) => {
    if (!rawUrl) return null;
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }
    const trimmed = rawUrl.replace(/^\\+/g, "").replace(/^\/+/, "");
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${trimmed}`;
  };

  const handlePreview = (lecture) => {
    const videoSrc = buildVideoUrl(lecture?.videoUrl);
    if (!videoSrc) return;
    setPreviewLecture({
      title: lecture?.title || "Preview",
      src: videoSrc,
    });
  };

  const handleBack = () => navigate(-1);

  if (!course) {
    return (
      <div className="viewCoursePage">
        <div className="viewCourseWrapper">
          <button className="vcBackBtn" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>

          <div className="vcEmptyState">
            <h2>Course not found</h2>
            <p>Please select a different course from the catalog.</p>
            <button className="vcPrimaryBtn" onClick={() => navigate("/all-courses")}>Go to Courses</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="viewCoursePage">
      <div className="viewCourseWrapper">
        <button className="vcBackBtn" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>

        <section className="vcHero">
          <div className="vcThumb">
            <img src={courseThumb} alt={course?.title} />
          </div>
          <div className="vcHeroContent">
            <p className="vcBadge">{course?.category || "Popular Course"}</p>
            <h1 className="vcTitle">{course?.title}</h1>
            <p className="vcSubtitle">{course?.subTitle}</p>

            <div className="vcMetaRow">
              <span>{course?.level || "All Levels"}</span>
              <span>{lectures.length} Lectures</span>
              <span>Lifetime access</span>
            </div>

            <div className="vcStatRow">
              <div className="vcStat">
                <MdOndemandVideo />
                <div>
                  <p>{lectures.length || 0}</p>
                  <small>Video Lessons</small>
                </div>
              </div>
              <div className="vcStat">
                <MdOutlineAccessTime />
                <div>
                  <p>10+ hrs</p>
                  <small>On-demand content</small>
                </div>
              </div>
              <div className="vcStat">
                <MdOutlineWorkspacePremium />
                <div>
                  <p>Certificate</p>
                  <small>After completion</small>
                </div>
              </div>
            </div>

            <div className="vcPriceRow">
              <div>
                <p className="vcLabel">Course Price</p>
                <p className="vcPrice">{formatPrice(course?.price)}</p>
              </div>
              <button className="vcPrimaryBtn">Enroll Now</button>
            </div>
          </div>
        </section>

        <section className="vcInfoFlex">
          <div className="vcInfoCard">
            <h2>What you'll learn</h2>
            <ul>
              {learningPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="vcInfoCard">
            <h2>Who this course is for</h2>
            <ul>
              {audience.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="vcLectures">
          <div className="vcSectionHeading">
            <h2>Course Curriculum</h2>
            <span>{lectures.length} modules</span>
          </div>

          {lectures.length ? (
            <div className="vcLectureList">
              {lectures.map((lecture, index) => (
                <div className="vcLectureCard" key={lecture?._id || index}>
                  <div className="vcLectureIndex">{index + 1}</div>
                  <div className="vcLectureBody">
                    <p className="vcLectureTitle">{lecture?.title}</p>
                    {lecture?.isPreviewFree ? (
                      <button
                        type="button"
                        className="vcLectureTag free"
                        onClick={() => handlePreview(lecture)}
                      >
                        <FaPlay className="vcPreviewIcon" />
                        Free Preview
                      </button>
                    ) : (
                      <span className="vcLectureTag locked">Premium</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="vcEmptyState">
              <p>No lectures added yet. Stay tuned!</p>
            </div>
          )}
        </section>
      </div>

      {previewLecture && (
        <div className="vcPreviewOverlay" onClick={() => setPreviewLecture(null)}>
          <div className="vcPreviewCard" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vcPreviewClose"
              onClick={() => setPreviewLecture(null)}
            >
              ×
            </button>
            <h3>{previewLecture.title}</h3>
            <video controls src={previewLecture.src} autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourses;
