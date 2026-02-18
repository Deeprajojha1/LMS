import React from "react";
import { FaGooglePlay } from "react-icons/fa";
import "./ExploreCouses.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ExploreCouses = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  const handleExploreClick = () => {
    navigate(userData ? "/all-courses" : "/login");
  };

  return (
    <div className="ExploreCouses-container">
      {/* Left Section */}
      <div className="ExploreOurCouses-container">
        <h1 className="ExploreOurCouses-heading">Explore Our Courses</h1>

        <p className="ExploreOurCouses-para">
          Explore Our Courses is a modern and user-friendly web section designed
          to help users discover available courses easily. It showcases course
          details in a clean layout with smooth navigation and a responsive
          design that works well on both mobile and desktop. The goal of this
          section is to provide a simple and attractive way for learners to
          explore different categories, understand course offerings, and start
          learning quickly.
        </p>

        <button className="ExploreOurCouses-button" onClick={handleExploreClick}>
          Explore Courses <FaGooglePlay />
        </button>
      </div>

      {/* Right Section */}
      <div className="AllOurCouses-container">
        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/4EVfjoIDAmNJFGK1ets2-R6YFfE6Ay55VDi0Oadujms/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vMzA4NDU5/ODgvNDI2NzYvaS80/NTAvZGVwb3NpdHBo/b3Rvc180MjY3NjUy/MjQtc3RvY2stcGhv/dG8td2ViLWRldmVs/b3BtZW50LWluc2Ny/aXB0aW9uLWxhcHRv/cC1jb2RlLmpwZw"
            alt="Web Development"
          />
          <h1>Web Development</h1>
        </div>

        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/PYysdx9RDpXjbPuFQsZsbbeui2dj0CduvP0YQ4R7WUQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dXhkZXNpZ25pbnN0/aXR1dGUuY29tL2Js/b2cvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMDQvU2NyZWVu/c2hvdC0yMDI0LTEx/LTI2LWF0LTE1LjA0/LjIyLnBuZw"
            alt="UI/UX Designing"
          />
          <h1>UI/UX Designing</h1>
        </div>

        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/RRPKUBNPR8EcUvlAG3nf4GoLOfqerW70H5mGIR3B1uo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/YXBwLWRldmVsb3Bt/ZW50LW1vYmlsZS10/ZW1wbGF0ZV8yMy0y/MTQ4NjgxMjUxLmpw/Zz9zZW10PWFpc19o/eWJyaWQmdz03NDAm/cT04MA"
            alt="App Development"
          />
          <h1>App Development</h1>
        </div>

        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/Yf2LfUt04dYnvKC2nY1zSd32J1sl8h7aLbPESOZqc2M/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA0/NjE2NTg2OC9waG90/by9ldGhpY2FsLWhh/Y2tpbmctZGF0YS1i/cmVhY2gtdHJhY2tp/bmctMmQtaWxsdXN0/cmF0aW9uLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1feGRo/ZFhQNjU1SXhpMmRn/Q3U3VDdrZ3Nackc0/MUZMYU55VWxESGp2/T2UwPQ"
            alt="Ethical Hacking"
          />
          <h1>Ethical Hacking</h1>
        </div>

        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/vHZriREWYDk-ugQtWDDXdRQE_CurUhoAfygpz80P1ug/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bXlncmVhdGxlYXJu/aW5nLmNvbS9ibG9n/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE5/LzA5L1doYXQtaXMt/ZGF0YS1zY2llbmNl/LTIuanBn"
            alt="Data Science"
          />
          <h1>Data Science</h1>
        </div>

        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/Fctl_vZdOvySb-OWdBtkRja3-1XXkoq8wyxG5n6Tx18/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcm9m/ZXNzaW9uYWxwcm9n/cmFtcy5taXQuZWR1/L2NvcmUvdXBsb2Fk/cy9ibG9nLXBvc3Qt/QUktdnMtTUwtMTAy/NFgxMDI0LmpwZw"
            alt="AI/ML"
          />
          <h1>AI/ML</h1>
        </div>

        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/uL8vMiG3EymmBzfNl9SD4LllOF1kvv-QH7dfvphcI-E/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9kYXRhLWFuYWx5/c2lzLWJ1c2luZXNz/LWZpbmFuY2UtY29u/Y2VwdF8zMTk2NS0x/MzMzOC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA"
            alt="Data Analysis"
          />
          <h1>Data Analysis</h1>
        </div>

        <div className="course-card">
          <img
            src="https://imgs.search.brave.com/Zjw3qNyqWYct346_zJ-ZqwKOXHAciCPp7_SQAMLbrBk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE3/MDg4OTk4NC9waG90/by9kaWdpdGFsLWFi/c3RyYWN0LWNwdS1h/aS1hcnRpZmljaWFs/LWludGVsbGlnZW5j/ZS1hbmQtbWFjaGlu/ZS1sZWFybmluZy1j/b25jZXB0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1abGln/cUNHRGFMdWxNOVBD/NnFWd0Z4aFUtQVZ0/T1J4UFJRSlVvMmhD/SHdzPQ"
            alt="AI Tools"
          />
          <h1>AI Tools</h1>
        </div>
      </div>
    </div>
  );
};

export default ExploreCouses;
