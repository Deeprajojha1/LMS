import React, { useState } from "react";
import "./SignUp.css";
import googleImage from "../../assets/google.jpg";
import { IoMdEyeOff } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../utils/firebase";


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    agree: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    const { name, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.warning("Please select a role ⚠️");
      return;
    }

    if (!formData.agree) {
      toast.info("Please agree to the terms and conditions ✅");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/users/signup",
        formData
        , { withCredentials: true }
      );
      dispatch(setUserData(res.data.user));
      localStorage.setItem("lms_user", JSON.stringify(res.data.user));
      toast.success(res.data?.message || "Signup Successful ✅");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        agree: false,
      });
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed ❌");
    } finally {
      setLoading(false);
    }
  };


const googleSignup = async () => {
  try {
    // Google popup
    const response = await signInWithPopup(auth, provider);
    const user = response.user;

    const payload = {
      name: user.displayName,
      email: user.email,
      role: formData.role || "student",
    };

    const res = await axios.post(
      "http://localhost:3000/api/auth/google",
      payload,
      { withCredentials: true }
    );

    dispatch(setUserData(res.data.user));
    localStorage.setItem("lms_user", JSON.stringify(res.data.user));
    toast.success(res.data?.message || "Signup Successful ✅");

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      agree: false,
    });

    navigate("/", { replace: true });
  } catch (error) {
    console.error("Google Signup Error:", error);
    toast.error(error.response?.data?.message || "Signup Failed ❌");
  }
};


  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="left">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoMdEyeOff /> : <IoEyeOutline />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            {/* <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>

              <div className="password-box">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}

                >
                  {showConfirmPassword ? <IoMdEyeOff /> : <IoEyeOutline />}
                </span>
              </div>
            </div> */}

            {/* Role */}
            <div className="form-group">
              <label>Role</label>

              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    required
                  />
                  Student
                </label>

                <label className="radio-item">
                  <input
                    type="radio"
                    name="role"
                    value="educator"
                    checked={formData.role === "educator"}
                    onChange={handleChange}
                    required
                  />
                  Educator
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <label htmlFor="agree">I agree to the terms and conditions</label>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
            </button>


            {/* Divider */}
            <div className="second-option">
              <hr />
              <div>Or continue</div>
              <hr />
            </div>

            {/* Google Button */}
            <div className="signup-with-google">
              <img
                src={googleImage}
                alt="googlesignup"
                className="google-signup-image"
              />
              <p className="google-text" onClick={googleSignup}>Continue with Google</p>
            </div>
            <p className="auth-switch">
              Already have an account?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => navigate("/login", { replace: true })}
              >
                Login
              </button>

            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
