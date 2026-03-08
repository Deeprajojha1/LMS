import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOndemandVideo, MdOutlineAccessTime, MdOutlineWorkspacePremium } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { setSelectedCourse } from "../../redux/courseSlice";
import "./ViewCourses.css";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (typeof value._id === "string") return value._id;
    if (typeof value.id === "string") return value.id;
    if (value._id && typeof value._id.toString === "function") return value._id.toString();
    if (value.id && typeof value.id.toString === "function") return value.id.toString();
    if (typeof value.toString === "function") {
      const str = value.toString();
      return str === "[object Object]" ? "" : str;
    }
  }
  return "";
};

const ViewCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { courseData, selectedCourse, courses } = useSelector((state) => state.course);
  const userData = useSelector((state) => state.user.userData);
  const currentUserId = useMemo(() => normalizeId(userData), [userData]);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState("");
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, reviewCount: 0 });

  const courseFromPublished = useMemo(() => {
    if (!courseData) return null;
    return courseData.find((item) => item?._id === courseId);
  }, [courseData, courseId]);

  const courseFromCreator = useMemo(() => {
    if (!courses) return null;
    return courses.find((item) => item?._id === courseId);
  }, [courses, courseId]);

  const course = courseFromPublished || courseFromCreator || selectedCourse;
  const lectures = useMemo(() => course?.lectures || [], [course]);
  const hasLectures = lectures.length > 0;

  useEffect(() => {
    if (course) {
      dispatch(setSelectedCourse(course));
    }
  }, [course, courseId, dispatch]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsReviewLoading(true);
        const response = await axios.get(`http://localhost:3000/api/courses/${courseId}/reviews`, {
          withCredentials: true,
        });
        setReviews(response.data?.reviews || []);
        setReviewStats({
          averageRating: response.data?.averageRating || 0,
          reviewCount: response.data?.reviewCount || 0,
        });
      } catch (error) {
        console.log("Fetch reviews error:", error.response?.data || error.message);
      } finally {
        setIsReviewLoading(false);
      }
    };

    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

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

  const canWatchNow = isCourseFree || hasFreePreviewLecture;
  const hasReviewEligibleVideo = useMemo(() => {
    if (!lectures?.length) return false;
    return lectures.some((lecture) => String(lecture?.videoUrl || "").trim().length > 0);
  }, [lectures]);

  const premiumLectureCount = useMemo(() => {
    if (!lectures?.length) return 0;
    return lectures.filter((lecture) => !lecture?.isPreviewFree).length;
  }, [lectures]);

  const handleBack = () => navigate(-1);

  const handlePrimaryAction = () => {
    if (hasLectures && canWatchNow) {
      navigate(`/watch-course/${courseId}`);
    }
  };

  const handleEnrollAction = () => {
    if (!hasLectures) return;
    toast.info("Enrollment coming soon.");
  };

  const handleSubmitReview = async () => {
    if (!userData) {
      toast.info("Please login to submit a review.");
      navigate("/login");
      return;
    }

    if (!reviewRating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write your review.");
      return;
    }

    if (!hasReviewEligibleVideo) {
      toast.error("You can review this course only after at least one lecture video is added.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await axios.post(
        `http://localhost:3000/api/courses/${courseId}/reviews`,
        { rating: reviewRating, comment: reviewComment.trim() },
        { withCredentials: true }
      );

      const submittedReview = response.data?.review;
      if (submittedReview) {
        setReviews((prev) => {
          const withoutCurrentUser = prev.filter(
            (item) => item?.user?._id !== submittedReview?.user?._id
          );
          return [submittedReview, ...withoutCurrentUser];
        });
      }

      setReviewComment("");
      setReviewRating(0);
      toast.success("Review submitted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId || !courseId) return;

    try {
      setDeletingReviewId(reviewId);
      await axios.delete(`http://localhost:3000/api/courses/${courseId}/reviews/${reviewId}`, {
        withCredentials: true,
      });

      setReviews((prev) => {
        const nextReviews = prev.filter((item) => item?._id !== reviewId);
        const nextCount = nextReviews.length;
        const nextAvg = nextCount
          ? Number(
            (
              nextReviews.reduce((acc, item) => acc + Number(item?.rating || 0), 0) / nextCount
            ).toFixed(1)
          )
          : 0;

        setReviewStats({
          averageRating: nextAvg,
          reviewCount: nextCount,
        });

        return nextReviews;
      });
      toast.success("Review deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeletingReviewId("");
    }
  };

  if (!course) {
    if (!courseData && !courses && !selectedCourse) {
      return (
        <div className="viewCoursePage">
          <div className="viewCourseWrapper">
            <button className="vcBackBtn" onClick={handleBack}>
              <FaArrowLeft /> Back
            </button>
            <div className="vcEmptyState">
              <h2>Loading course...</h2>
              <p>Please wait a moment.</p>
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
              {hasLectures ? (
                canWatchNow && !isCourseFree ? (
                  <div className="vcBtnGroup">
                    <button className="vcPrimaryBtn" onClick={handlePrimaryAction} type="button">
                      <FaPlay /> Watch Now
                    </button>
                    <button className="vcSecondaryBtn" onClick={handleEnrollAction} type="button">
                      <HiMiniAcademicCap /> Enroll Now
                    </button>
                  </div>
                ) : (
                  <button
                    className="vcPrimaryBtn"
                    onClick={canWatchNow ? handlePrimaryAction : handleEnrollAction}
                    type="button"
                  >
                    {canWatchNow ? (
                      <>
                        <FaPlay /> Watch Now
                      </>
                    ) : (
                      <>
                        <HiMiniAcademicCap /> Enroll Now
                      </>
                    )}
                  </button>
                )
              ) : null}
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
            <span>
              {lectures.length} modules{!isCourseFree && premiumLectureCount ? ` • ${premiumLectureCount} premium` : ""}
            </span>
          </div>

          {lectures.length ? (
            <div className="vcLectureList">
              {lectures.map((lecture, index) => (
                <div className="vcLectureCard" key={lecture?._id || index}>
                  <div className="vcLectureIndex">{index + 1}</div>
                  <div className="vcLectureBody">
                    <p className="vcLectureTitle">{lecture?.title}</p>
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

        <section className="vcReviews">
          <div className="vcSectionHeading">
            <h2>Write a Review</h2>
            <span>
              {reviewStats.averageRating ? `${reviewStats.averageRating}/5` : "No rating yet"} •{" "}
              {reviewStats.reviewCount} review{reviewStats.reviewCount === 1 ? "" : "s"}
            </span>
          </div>

          {!hasReviewEligibleVideo && (
            <p className="vcReviewEmpty">
              Reviews are disabled for this course until at least one lecture video is available.
            </p>
          )}

          <div className="vcReviewForm">
            <div className="vcRatingRow">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`vcStarBtn ${star <= reviewRating ? "active" : ""}`}
                  onClick={() => setReviewRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="vcReviewInput"
              placeholder="Write your review here..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
            />

            <button
              className="vcPrimaryBtn"
              type="button"
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !hasReviewEligibleVideo}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          <div className="vcReviewList">
            {isReviewLoading ? (
              <p className="vcReviewEmpty">Loading reviews...</p>
            ) : reviews.length ? (
              reviews.map((review) => (
                <article className="vcReviewCard" key={review._id}>
                  <div className="vcReviewTop">
                    <div>
                      <p className="vcReviewName">{review?.user?.name || "Learner"}</p>
                      <p className="vcReviewDate">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="vcReviewActions">
                      <p className="vcReviewRating">
                        {[1, 2, 3, 4, 5].map((star) => (star <= review.rating ? "\u2605" : "\u2606"))}
                      </p>
                      {normalizeId(review?.user) === currentUserId && (
                        <button
                          type="button"
                          className="vcDeleteReviewBtn"
                          onClick={() => handleDeleteReview(review._id)}
                          disabled={deletingReviewId === review._id}
                          title="Delete review"
                          aria-label="Delete review"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="vcReviewComment">{review.comment}</p>
                </article>
              ))
            ) : (
              <p className="vcReviewEmpty">No reviews yet. Be the first to review this course.</p>
            )}
          </div>
        </section>
      </div>

    </div>
  );
};

export default ViewCourses;

