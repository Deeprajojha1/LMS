import React from "react";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-brand">
          <div className="footer-mark">VC</div>
          <h3>Virtual Courses</h3>
          <p>
            AI-powered learning platform to help you grow smarter. Learn
            anything, anytime, anywhere.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/">Home</a>
          <a href="/all-courses">All Courses</a>
          <a href="/login">Login</a>
          <a href="/profile">My Profile</a>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <a href="/all-courses">Web Development</a>
          <a href="/all-courses">App Development</a>
          <a href="/all-courses">AI/ML</a>
          <a href="/all-courses">UI/UX Designing</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} LearnAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
