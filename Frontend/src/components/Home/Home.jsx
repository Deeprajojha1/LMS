import React from "react";
import Nav from "../Navbar/Nav";
import homeDesktop from "../../assets/home1.jpg";
import homeMobile from "../../assets/home.jpg";
import SearchAi from "../../assets/SearchAi.png";
import Logo from "../Logo/Logo";
import "./Home.css";
import { FaGooglePlay } from "react-icons/fa";
import ExploreCouses from "../ExploreCouses/ExploreCouses";
import Cart from "../Card/Card";
import { useNavigate } from "react-router-dom";
import About from "../About/About";
import Footer from "../Footer/Footer";
import ReviewPage from "../ReviewPage/ReviewPage";

const Home = () => {
  const navigate=useNavigate();
  return (
    <>
      <Nav />

      <section className="home-container">
        <picture>
          <source media="(max-width: 768px)" srcSet={homeMobile} />
          <img src={homeDesktop} alt="Home Banner" className="home-image" />
        </picture>

        <div className="home-overlay">
          <h1>
            Grow Your Skills to Advance <br />
            <span>Your Career Path</span>
          </h1>

          <div className="home-buttons">
            <button className="primary-btn" onClick={() => navigate('/all-courses')}>View All Courses <FaGooglePlay /></button>

            <button className="secondary-btn" onClick={() => navigate('/search-with-ai')}>
              <img src={SearchAi} alt="AI Search" />
              Search with AI
            </button>
          </div>
        </div>
      </section>
       {/* <Logo/> */}
       <ExploreCouses />
       <Cart/>
       <ReviewPage />
       <About/>
       <Footer/>
    </>
  );
};

export default Home;
