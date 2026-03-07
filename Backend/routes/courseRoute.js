import express from "express";
import { createCourse, editCourse, deleteCourse, getCourseById,getPublishedCourses,getCreaterCourses
    ,createLecture,getCourseLeacture,editLecture,removeLecture,addOrUpdateCourseReview,getCourseReviews
 } from "../controllers/courseController.js";
import  upload  from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const router=express.Router();

router.post("/create",isAuth,createCourse);
router.get("/getpublished",getPublishedCourses);
router.get("/getcreatercourses",isAuth,getCreaterCourses);
router.post("/edit/:id",isAuth,upload.single("thumnail"),editCourse);
router.delete("/delete/:id",isAuth,deleteCourse);
router.get("/getcourse/:id",isAuth,getCourseById);

// lecture routes
router.post("/createlecture/:courseId",isAuth,createLecture);
router.get("/getcourselecture/:id",isAuth,getCourseLeacture);
router.post("/editlecture/:lectureId",isAuth,upload.single("video"),editLecture);
router.delete("/removeteature/:lectureId",isAuth,removeLecture);

// review routes
router.get("/:courseId/reviews", getCourseReviews);
router.post("/:courseId/reviews", isAuth, addOrUpdateCourseReview);

export default router;
