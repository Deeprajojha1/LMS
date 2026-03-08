import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "../ReviewCard/ReviewCard.jsx";
import "./ReviewPage.css";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/courses/reviews/latest?limit=6", {
          withCredentials: true,
        });
        setReviews(response.data?.reviews || []);
      } catch (error) {
        console.log("Fetch latest reviews error:", error.response?.data || error.message);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestReviews();
  }, []);

  return (
    <section className="review-section">
      <div className="review-heading">
        <p>Student Testimonials</p>
        <h2>Trusted by Learners Across Programs</h2>
      </div>

      <div className="review-grid">
        {isLoading ? (
          <p className="review-empty">Loading reviews...</p>
        ) : reviews.length ? (
          reviews.map((item, idx) => (
            <ReviewCard
              key={item._id || idx}
              name={item?.user?.name || "Learner"}
              role={item?.course?.title || item?.user?.role || "Student"}
              review={item?.comment || ""}
              rating={Number(item?.rating || 0)}
              avatar={item?.user?.photoUrl || ""}
              highlight={idx === 0}
            />
          ))
        ) : (
          <p className="review-empty">No reviews available right now.</p>
        )}
      </div>
    </section>
  );
};

export default ReviewPage;
