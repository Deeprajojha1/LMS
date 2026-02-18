import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//  Transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.USER_EMAIL, // your gmail
    pass: process.env.USER_PASSWORD, //  app password
  },
});

// Function to send OTP email
const sendEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.USER_EMAIL, 
      to: to,
      subject: "Reset Your Password - OTP",
      text: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 15px;">
          <h2 style="color: #2563eb;">Password Reset OTP</h2>
          <p>Hello 👋</p>
          <p>Your OTP for resetting password is:</p>

          <h1 style="letter-spacing: 4px; color: #111827;">${otp}</h1>

          <p style="color: gray;">This OTP is valid for only 5 minutes.</p>
          <p>Thanks,<br/>LMS Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent Successfully:", info.messageId);

    return true;
  } catch (error) {
    console.log("❌ Email Send Error:", error.message);
    return false;
  }
};

export default sendEmail;
