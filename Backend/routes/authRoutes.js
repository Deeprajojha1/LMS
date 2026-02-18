import express from "express";
import { sendOtp, verifyOtp, resetPassword } from '../controllers/UserController.js';

const router = express.Router();

// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.post("/reset-password", resetPassword);


export default router;
