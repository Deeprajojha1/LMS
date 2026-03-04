import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import getToken from '../config/token.js';
import loginSchema from '../config/loginValidator.js';
import sendEmail from '../config/sendMail.js';
import crypto from "crypto";
import uploadOnCloudinary from '../config/cloudinary.js';
import { response } from 'express';

// signUp
export const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const checkUser = await User.findOne({ email });

        // User already exists
        if (checkUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: 'Enter valid email'
            });
        }

        // Password validation
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Enter strong password'
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashPassword,   //  FIX
            role,
        });

        await newUser.save();

        // Generate token
        const token = await getToken(newUser._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};
// Login
export const login = async (req, res) => {
    try {
        const error = loginSchema(req.body);
        if (error) {
            return res.status(400).json({ message: error });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = await getToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // true in production
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Login successful',
            user,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Login failed',
            error: error.message
        });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logout successful ",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// get profile
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User fetched successfully ",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// send otp
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    let user = await User.findOne({ email });
    
    // Create temp user if doesn't exist (for testing)
    if (!user) {
      user = new User({ email });
    }

    // OTP generate (4 digit)
    const otp = Math.floor(Math.random() * 9000 + 1000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerifed = false;

    await user.save({ validateBeforeSave: false });

    const isEmailSent = await sendEmail(email, otp);
    if (!isEmailSent) {
      return res.status(500).json({
        message: "OTP saved but email not sent. Try again!",
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully ",
    });
  } catch (error) {
    console.log("Send OTP Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// verify otp

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    //  user exists + otp stored + expiry exists
    if (!user || !user.resetOtp || !user.otpExpires) {
      return res.status(401).json({
        message: "Invalid email or OTP",
      });
    }

    //  OTP Expired check
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired ❌",
      });
    }

    //  OTP Match check
    if (user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP ❌",
      });
    }

    // OTP Verified
    user.isOtpVerifed = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined; 
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "OTP Verified Successfully ",
    });
  } catch (error) {
    console.log("Verify OTP Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// reset password

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    //  Basic checks
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email",
      });
    }

    //  OTP must be verified before reset
    if (!user.isOtpVerifed) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    //  Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // clear otp data after reset
    user.resetOtp = null;
    user.otpExpires = null;
    user.isOtpVerifed = false;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "Password reset successfully ",
    });
  } catch (error) {
    console.log("Reset Password Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// google signup/login
export const GoogleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    // if user not exist -> create new
    if (!user) {
      user = await User.create({
        name: name || "User",
        email,
        role: role || "student",
        password: crypto.randomBytes(20).toString("hex")
      });
      
    }

    const token = await getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production (https)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google Auth Success",
      user,
      token,
    });
  } catch (error) {
    console.log("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;

    let photoUrl = "";

    //  If file exists, upload to cloudinary
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);

      if (!uploaded) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed ❌",
        });
      }

      photoUrl = uploaded.secure_url;
    }

    // Update Data Object
    const updateData = {};
    if (description) updateData.description = description;
    if (name) updateData.name = name;
    if (photoUrl) updateData.photoUrl = photoUrl;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully ✅",
      user,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error ❌",
    });
  }
};