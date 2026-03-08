import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import "./ReviewCard.css";

const ReviewCard = ({ name, role, review, rating, avatar, highlight }) => {
  const cardClass = highlight
    ? "review-card review-card-highlight"
    : "review-card";

  const initials = String(name || "L")
    .trim()
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className={cardClass}>
      <div className="review-head">
        {avatar ? (
          <img src={avatar} alt={name} className="review-avatar review-avatar-image" />
        ) : (
          <div className="review-avatar" aria-hidden="true">
            {initials}
          </div>
        )}
        <div className="review-user">
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
      </div>

      <p className="review-message">{review}</p>

      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <FaStar key={star} className="star-fill" />
          ) : (
            <FaRegStar key={star} className="star-empty" />
          )
        )}
      </div>
    </article>
  );
};

export default ReviewCard;
