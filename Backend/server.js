import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/connectionDB.js";
import userRoute from "./routes/userRoutes.js";
import authRoute from "./routes/authRoutes.js";
import googleAuthRoute from "./routes/googleAuth.js";
import courseRoute from "./routes/courseRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

app.use(express.json());
app.use(cookieParser());
app.use("/public", express.static("public"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// DB
connectDB();

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/auth", googleAuthRoute);
app.use("/api/courses", courseRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
