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

    // Dropdown popup (profile)
    const [show, setShow] = useState(false);
    const dropdownRef = useRef(null);

    //  Mobile slider menu
    const [menuOpen, setMenuOpen] = useState(false);

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

            toast.success(res.data?.message || "Logout Successful ✅");
            dispatch(clearUserData());
            setShow(false);
            setMenuOpen(false); //  close slider also
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout Failed ❌");
            console.log("Logout Error:", error.response?.data || error.message);
        }
    };

    //  Close profile popup when click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //  Close slider when screen becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="navbar">
            {/* Left */}
            <div className="nav-left" onClick={() => navigate("/")}>
                <img src={logo} alt="LMS_NavImg" className="nav-logo" />
                <h2 className="nav-title">LMS</h2>
            </div>

            {/*  Hamburger (Only for Mobile) */}
            <button className="hamburger-btn" onClick={() => setMenuOpen(true)}>
                ☰
            </button>

            {/*  Desktop Menu (same as your current) */}
            <div className="nav-right desktop-menu">
                {/* Profile + Dropdown */}

                <div className="profile-wrapper" ref={dropdownRef}>
                    <button
                        className="profile-btn"
                        onClick={() => setShow(!show)}
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
                            <p
                                className="dropdown-item"
                                onClick={() => {
                                    handleProtectedNavigation("/profile");
                                }}
                            >
                                My Profile
                            </p>

                            <p
                                className="dropdown-item"
                                onClick={() => {
                                    handleMyCoursesNavigation();
                                }}
                            >
                                My Courses
                            </p>
                        </div>
                    )}
                </div>


                {/* Dashboard only for educator */}
                {userData?.role === "educator" && (
                    <button className="nav-btn" onClick={() => handleProtectedNavigation("/dashboard")}>
                        Dashboard
                    </button>
                )}

                {/* Logout if logged in */}
                {userData && (
                    <button className="nav-btn logout" onClick={handleLogout}>
                        Logout
                    </button>
                )}

                {/* Login if not logged in */}
                {!userData && (
                    <button className="nav-btn primary" onClick={() => navigate("/login")}>
                        Login
                    </button>
                )}
            </div>

            <div className={`mobile-overlay ${menuOpen ? "active" : ""}`}>
                <div
                    className="mobile-slider"
                    onClick={(e) => e.stopPropagation()}   //  IMPORTANT
                >
                    {/* Top Header */}
                    <div className="mobile-header">
                        <h3>Menu</h3>
                        <button className="close-btn" onClick={() => setMenuOpen(false)}>
                            ✖
                        </button>
                    </div>

                    {/* Mobile Links */}
                    <div className="mobile-links">

                        <>
                            <button
                                className="mobile-item"
                                onClick={() => {
                                    handleProtectedNavigation("/profile");
                                }}
                            >
                                My Profile
                            </button>

                            <button
                                className="mobile-item"
                                onClick={() => {
                                    handleMyCoursesNavigation();
                                }}
                            >
                                My Courses
                            </button>
                        </>


                        {userData?.role === "educator" && (
                            <button
                                className="mobile-item"
                                onClick={() => {
                                    handleProtectedNavigation("/dashboard");
                                }}
                            >
                                Dashboard
                            </button>
                        )}

                        {userData && (
                            <button className="mobile-item logout-item" onClick={handleLogout}>
                                Logout
                            </button>
                        )}

                        {!userData && (
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
                </div>

                {/*  Background click closes slider */}
                <div className="overlay-bg" onClick={() => setMenuOpen(false)}></div>
            </div>

        </nav>
    );
};

export default Nav;
