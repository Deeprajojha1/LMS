import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { MdLock, MdPlayArrow } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../../redux/courseSlice";
import "./WatchCourse.css";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

const WatchCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const hasLectures = lectures.length > 0;

  useEffect(() => {
    if (course) {
      dispatch(setSelectedCourse(course));
    }
  }, [course, dispatch]);

  const isCourseFree = useMemo(() => {
    const price = course?.price;
    if (price === null || price === undefined || price === "") return true;
    if (typeof price === "string" && price.trim().toLowerCase() === "free") return true;
    const cleaned = typeof price === "string" ? price.replace(/[^\d.]/g, "") : price;
    const numeric = typeof cleaned === "number" ? cleaned : Number(cleaned);
    return !Number.isNaN(numeric) && numeric === 0;
  }, [course?.price]);

  const hasFreePreviewLecture = useMemo(() => {
    if (!lectures?.length) return false;
    return lectures.some((lecture) => Boolean(lecture?.isPreviewFree));
  }, [lectures]);

  const canWatchAnyLecture = isCourseFree || hasFreePreviewLecture;

  const isLectureWatchable = (lecture) => {
    if (!lecture) return false;
    if (isCourseFree) return true;
    return Boolean(lecture?.isPreviewFree);
  };

  const buildVideoUrl = (rawUrl) => {
    if (!rawUrl) return null;
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }
    const trimmed = rawUrl.replace(/^\\+/g, "").replace(/^\/+/, "");
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${trimmed}`;
  };

  const [activeLectureId, setActiveLectureId] = useState(null);

  const defaultLecture = useMemo(() => {
    if (!lectures.length) return null;
    if (isCourseFree) return lectures[0];
    return lectures.find((l) => l?.isPreviewFree) || null;
  }, [lectures, isCourseFree]);

  const activeLecture = useMemo(() => {
    if (!lectures.length) return null;
    if (!activeLectureId) return defaultLecture;
    return lectures.find((l) => l?._id === activeLectureId) || defaultLecture;
  }, [lectures, activeLectureId, defaultLecture]);

  const activeVideoSrc = useMemo(() => buildVideoUrl(activeLecture?.videoUrl), [activeLecture?.videoUrl]);

  const handleBack = () => navigate(-1);

  const handleSelectLecture = (lecture) => {
    if (!isLectureWatchable(lecture)) return;
    if (!lecture?._id) return;
    setActiveLectureId(lecture._id);
  };

  if (!course) {
    if (!courseData && !courses && !selectedCourse) {
      return (
        <div className="watchCoursePage">
          <div className="watchCourseWrapper">
            <button className="wcBackBtn" onClick={handleBack}>
              <FaArrowLeft /> Back
            </button>
            <div className="wcEmptyState">
              <h2>Loading course...</h2>
              <p>Please wait a moment.</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="watchCoursePage">
        <div className="watchCourseWrapper">
          <button className="wcBackBtn" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>

          <div className="wcEmptyState">
            <h2>Course not found</h2>
            <p>Please open the course again from the catalog.</p>
            <button className="wcPrimaryBtn" onClick={() => navigate("/all-courses")}>
              Go to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const courseThumb = course?.thumbnail || course?.thumnail || FALLBACK_THUMB;

  return (
    <div className="watchCoursePage">
      <div className="watchCourseWrapper">
        <button className="wcBackBtn" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>

        <section className="wcHeader">
          <div className="wcHeaderThumb">
            <img src={courseThumb} alt={course?.title} />
          </div>
          <div className="wcHeaderText">
            <p className="wcBadge">{course?.category || "Course"}</p>
            <h1 className="wcTitle">{course?.title}</h1>
            <p className="wcSubtitle">{course?.subTitle}</p>
            {!isCourseFree && !hasFreePreviewLecture && (
              <div className="wcPremiumNotice">
                <MdLock /> Premium course - lectures locked
              </div>
            )}
            {!isCourseFree && hasFreePreviewLecture && (
              <div className="wcPremiumNotice">
                <MdLock /> Premium course - free preview available
              </div>
            )}
          </div>
        </section>

        <section className="wcGrid">
          <div className="wcPlayerCard">
            {canWatchAnyLecture ? (
              activeVideoSrc ? (
                <video key={activeVideoSrc} controls src={activeVideoSrc} playsInline />
              ) : (
                <div className="wcPlayerEmpty">
                  <p>No video uploaded for this lecture yet.</p>
                </div>
              )
            ) : hasLectures ? (
              <div className="wcPlayerLocked">
                <MdLock />
                <h3>Premium Content</h3>
                <p>Enroll to unlock and watch all lectures in this course.</p>
              </div>
            ) : (
              <div className="wcPlayerEmpty">
                <p>No lectures added yet.</p>
              </div>
            )}

            <div className="wcNowPlaying">
              <p className="wcNowLabel">Now Playing</p>
              <h2 className="wcNowTitle">{activeLecture?.title || "Lecture"}</h2>
            </div>
          </div>

          <aside className="wcSidebar">
            <div className="wcSidebarHeader">
              <h2>All Lectures</h2>
              <span>{lectures.length}</span>
            </div>

            {lectures.length ? (
              <div className="wcLectureList">
                {lectures.map((lecture, index) => {
                  const isActive = lecture?._id && lecture._id === activeLecture?._id;
                  const watchable = isLectureWatchable(lecture);
                  return (
                    <button
                      type="button"
                      key={lecture?._id || index}
                      className={`wcLectureItem ${isActive ? "active" : ""} ${
                        watchable ? "" : "locked"
                      }`}
                      onClick={() => handleSelectLecture(lecture)}
                      disabled={!watchable}
                      title={!watchable ? "Premium" : lecture?.title}
                    >
                      <div className="wcLectureIndex">{index + 1}</div>
                      <div className="wcLectureBody">
                        <p className="wcLectureTitle">{lecture?.title}</p>
                        {watchable ? (
                          <span className="wcLectureTag play">
                            <MdPlayArrow />
                            {isCourseFree ? "Watch" : "Free Preview"}
                          </span>
                        ) : (
                          <span className="wcLectureTag premium">Premium</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="wcEmptyState">
                <p>No lectures added yet.</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
};

export default WatchCourse;
