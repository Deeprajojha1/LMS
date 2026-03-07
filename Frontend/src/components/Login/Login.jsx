import React, { useState } from "react";
import "./Login.css";
import googleImage from "../../assets/google.jpg";
import { IoMdEyeOff } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../utils/firebase";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:3000/api/users/login",
                formData,
                { withCredentials: true }
            );

            toast.success(res.data?.message || "Login Successful ✅");
            dispatch(setUserData(res.data.user));
            localStorage.setItem("lms_user", JSON.stringify(res.data.user));
            setFormData({
                email: "",
                password: "",
            });

            //  Navigate after login
            navigate("/", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed ❌");
        } finally {
            setLoading(false);
        }
    };
    const googleLogin = async () => {
        try {
            // Google popup
            const response = await signInWithPopup(auth, provider);
            const user = response.user;

            const payload = {
                name: user.displayName,
                email: user.email,
                role: "student",
            };

            const res = await axios.post(
                "http://localhost:3000/api/auth/google",
                payload,
                { withCredentials: true }
            );

            dispatch(setUserData(res.data.user));
            localStorage.setItem("lms_user", JSON.stringify(res.data.user));
            toast.success(res.data?.message || "Login Successful ✅");

            setFormData({
                email: "",
                password: "",

            });

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Google Signup Error:", error);
            toast.error(error.response?.data?.message || "Login Failed ❌");
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-left">
                    <h2>Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>

                            <div className="password-box">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <span
                                    className="eye-icon"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <IoMdEyeOff /> : <IoEyeOutline />}
                                </span>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="forgot-password">
                            <span className="forgot-link" onClick={() => navigate("/forgetPassword", { replace: true })}>Forgot Password?</span>
                        </div>

                        {/* Button with Loader */}
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
                        </button>

                        {/* Divider */}
                        <div className="second-option">
                            <hr />
                            <div>Or continue</div>
                            <hr />
                        </div>

                        {/* Google Button */}
                        <div className="login-with-google" onClick={googleLogin}>
                            <img
                                src={googleImage}
                                alt="googlelogin"
                                className="google-login-image"
                            />
                            <p className="google-text">Continue with Google</p>
                        </div>

                        <p className="auth-switch">
                            Don’t have an account?{" "}
                            <Link to="/signUp" className="link-item">
                                <span className="auth-link"><button
                                    type="button"
                                    className="auth-link-btn"
                                    onClick={() => navigate("/signUp", { replace: true })}
                                >
                                    Register
                                </button></span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
