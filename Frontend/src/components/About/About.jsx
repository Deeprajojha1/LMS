import React from "react";
import about from "../../assets/about.jpg";
import video from "../../assets/video.mp4";
import "./About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-shell">
        <div className="about-media">
          <img src={about} alt="Students learning together" className="about-image" />
          <video className="about-video" src={video} controls autoPlay muted loop playsInline />
        </div>

        <div className="about-content">
          <p className="about-kicker">ABOUT US</p>
          <h2>Learning Platform Designed for Real Progress</h2>
          <p className="about-description">
            We combine structured courses, practical lessons, and modern guidance to help
            learners build skills that matter. Every feature is designed to keep learning
            simple, measurable, and career-focused.
          </p>

          <div className="about-highlights">
            <article className="about-card">
              <h3>Career-Ready Learning</h3>
              <p>Project-focused content that helps learners apply concepts with confidence.</p>
            </article>
            <article className="about-card">
              <h3>Educator-First Tools</h3>
              <p>Powerful course management and publishing tools for instructors.</p>
            </article>
          </div>

          <div className="about-metrics">
            <div>
              <span>10K+</span>
              <p>Active Learners</p>
            </div>
            <div>
              <span>250+</span>
              <p>Structured Lessons</p>
            </div>
            <div>
              <span>98%</span>
              <p>Satisfaction Score</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
