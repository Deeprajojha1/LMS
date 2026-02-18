import React, { useEffect, useState } from "react";
import "./Forget.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Forget = () => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [time, setTime] = useState(5);
  const [second, setSecond] = useState(0);

  //  Separate loading states
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();

  //  Timer only on Step 2
  useEffect(() => {
    if (step !== 2) return;
    if (time === 0 && second === 0) return;

    const timer = setInterval(() => {
      if (second > 0) {
        setSecond((prev) => prev - 1);
      } else {
        if (time > 0) {
          setTime((prev) => prev - 1);
          setSecond(59);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [step, time, second]);

  //  Step 1: Send OTP (also used for Resend OTP)
  const sendOtp = async () => {
    try {
      if (!email) {
        return toast.error("Please enter email ❌");
      }

      setSendLoading(true);

      const res = await axios.post("http://localhost:3000/api/auth/send-otp", {
        email,
      });

      toast.success(res.data?.message || "OTP sent ✅");

      // ✅ Reset timer on OTP send
      setTime(5);
      setSecond(0);

      // ✅ Go to Step 2
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP send failed ❌");
    } finally {
      setSendLoading(false);
    }
  };

  //  Step 2: Verify OTP
  const verifyOtp = async () => {
    try {
      if (!otp) {
        return toast.error("Please enter OTP ❌");
      }

      setVerifyLoading(true);

      const res = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email,
        otp,
      });

      toast.success(res.data?.message || "OTP verified ");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed ❌");
    } finally {
      setVerifyLoading(false);
    }
  };

  //  Step 3: Reset Password
  const resetPassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        return toast.error("Please fill both password fields ❌");
      }

      setResetLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        { email, newPassword, confirmPassword }
      );

      toast.success(res.data?.message || "Password reset ");

      //  redirect to login
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed ❌");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="forget-page">
      <div className="forget-card">
        <h1 className="forget-heading">Forget Your Password?</h1>
        <p className="forget-desc">
          No worries! Reset your password in just 3 steps.
        </p>

        {/* Step Indicator */}
        <div className="forget-steps">
          <div className={`step-dot ${step === 1 ? "active" : ""}`}>1</div>
          <div className="step-line"></div>
          <div className={`step-dot ${step === 2 ? "active" : ""}`}>2</div>
          <div className="step-line"></div>
          <div className={`step-dot ${step === 3 ? "active" : ""}`}>3</div>
        </div>

        {/*  STEP 1 */}
        {step === 1 && (
          <div className="step-box">
            <h2 className="step-title">Step 1: Email</h2>

            <form className="forget-form">
              <div className="input-box">
                <label className="forget-label">Enter Your Email Address</label>
                <input
                  type="text"
                  className="forget-input"
                  placeholder="Abcde1234@gexample.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                className="forget-btn"
                type="button"
                onClick={sendOtp}
                disabled={sendLoading}
              >
                {sendLoading ? "Sending..." : "Send OTP"}
              </button>

              <p className="auth-switch">
                Go to Login?{" "}
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
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="step-box">
            <h2 className="step-title">Step 2: Verify OTP</h2>

            <form className="forget-form">
              <div className="input-box">
                <label className="forget-label">Enter OTP</label>
                <input
                  type="text"
                  className="forget-input"
                  placeholder="Enter 6 digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              {/*  Timer / Resend */}
              {(time > 0 || second > 0) ? (
                <p className="otp-text">
                  OTP expires in:{" "}
                  <span className="otp-time">
                    {time < 10 ? `0${time}` : time}:
                    {second < 10 ? `0${second}` : second}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  className="resend-link-btn"
                  onClick={sendOtp}
                  disabled={sendLoading}
                >
                  {sendLoading ? "Resending..." : "Resend OTP"}
                </button>
              )}

              <div className="btn-row">
                <button
                  className="forget-btn light"
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={verifyLoading}
                >
                  Back
                </button>

                <button
                  className="forget-btn"
                  type="button"
                  onClick={verifyOtp}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              <p className="auth-switch">
                Go to Login?{" "}
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
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="step-box">
            <h2 className="step-title">Step 3: Set New Password</h2>

            <form className="forget-form">
              <div className="input-box">
                <label className="forget-label">New Password</label>
                <input
                  type="password"
                  className="forget-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-box">
                <label className="forget-label">Confirm Password</label>
                <input
                  type="password"
                  className="forget-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="btn-row">
                <button
                  className="forget-btn light"
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={resetLoading}
                >
                  Back
                </button>

                <button
                  className="forget-btn"
                  type="button"
                  onClick={resetPassword}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>

              <p className="auth-switch">
                Go to Login?{" "}
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
        )}
      </div>
    </div>
  );
};

export default Forget;
