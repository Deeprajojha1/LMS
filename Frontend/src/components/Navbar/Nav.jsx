import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.jpg";
import "./Nav.css";

import { useSelector, useDispatch } from "react-redux";
import { clearUserData } from "../../redux/userSlice";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Nav = () => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProtectedNavigation = (path) => {
    if (!userData) {
      navigate("/login");
      setShow(false);
      setMenuOpen(false);
      return;
    }

    navigate(path);
    setShow(false);
    setMenuOpen(false);
  };

  const handleMyCoursesNavigation = () => {
    const targetPath = userData?.role === "educator" ? "/courses" : "/all-courses";
    handleProtectedNavigation(targetPath);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/logout",
        {},
        { withCredentials: true }
      );

      toast.success(res.data?.message || "Logout Successful");
      dispatch(clearUserData());
      localStorage.removeItem("lms_user");
      setShow(false);
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout Failed");
      console.log("Logout Error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="LMS_NavImg" className="nav-logo" />
        <h2 className="nav-title">LMS</h2>
      </div>

      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="nav-right desktop-menu">
        <div className="profile-wrapper" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setShow((prev) => !prev)}
            title={userData?.name || "User"}
          >
            {userData?.photoUrl ? (
              <img src={userData.photoUrl} alt="profile" />
            ) : (
              <div className="avatar-fallback">
                {(userData?.name?.charAt(0) || "U").toUpperCase()}
              </div>
            )}
          </button>

          {show && (
            <div className="profile-dropdown">
              <p className="dropdown-item" onClick={() => handleProtectedNavigation("/profile")}>
                My Profile
              </p>
              <p className="dropdown-item" onClick={handleMyCoursesNavigation}>
                My Courses
              </p>
            </div>
          )}
        </div>

        {userData?.role === "educator" && (
          <button className="nav-btn" onClick={() => handleProtectedNavigation("/dashboard")}>
            Dashboard
          </button>
        )}

        {userData ? (
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="nav-btn primary" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>

      <div className={`mobile-overlay ${menuOpen ? "active" : ""}`}>
        <div className="overlay-bg" onClick={() => setMenuOpen(false)} />

        <aside className="mobile-slider" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-header">
            <h3>Menu</h3>
            <button
              className="close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="mobile-links">
            <button className="mobile-item" onClick={() => handleProtectedNavigation("/profile")}>
              My Profile
            </button>
            <button className="mobile-item" onClick={handleMyCoursesNavigation}>
              My Courses
            </button>

            {userData?.role === "educator" && (
              <button
                className="mobile-item"
                onClick={() => handleProtectedNavigation("/dashboard")}
              >
                Dashboard
              </button>
            )}

            {userData ? (
              <button className="mobile-item logout-item" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button
                className="mobile-item primary-item"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                Login
              </button>
            )}
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default Nav;
