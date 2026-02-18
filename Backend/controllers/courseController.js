

import { Course } from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";

import uploadOnCloudinary from "../config/cloudinary.js";

export const createCourse = async (req, res) => {

    try {

        console.log("Request body:", req.body);

        console.log("User ID from token:", req.userId);



        const { title, category } = req.body;

        if (!title || !category) {

            return res.status(400).json({ message: "Title and category are required" });

        }



        const course = await Course.create({

            title,

            category,

            creator: req.userId

        });



        console.log("Course created successfully:", course);

        return res.status(201).json({ message: "Course created successfully", course });

    } catch (error) {

        console.log("Error in createCourse:", error.message);

        console.log("Error details:", error);

        return res.status(500).json({ message: "Internal server error", error: error.message });

    }

}

export const getPublishedCourses = async (req, res) => {

    try {

        const courses = await Course.find({ isPublished: true });

        return res.status(200).json({ message: "Courses fetched successfully", courses });

    } catch (error) {

        console.log(error);

        return res.status(500).json({ message: "Internal server error" });

    }

}



export const getCreaterCourses = async (req, res) => {

    try {

        const courses = await Course.find({ creator: req.userId });

        return res.status(200).json({ message: "Courses fetched successfully", courses });

    } catch (error) {

        console.log(error);

        return res.status(500).json({ message: "Internal server error" });

    }

}

export const editCourse = async (req, res) => {

    try {

        const { title, subTitle, description, category, level, price, isPublished } = req.body;

        let thumnail

        if (req.file) {

            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            thumnail = cloudinaryResponse?.secure_url;

        }

        let course = await Course.findById(req.params.id);

        if (!course) {

            return res.status(404).json({ message: "Course not found" });

        }

        course = await Course.findByIdAndUpdate(req.params.id, {

            ...req.body,

            thumnail

        }, { new: true });

        return res.status(200).json({ message: "Course updated successfully", course });

    } catch (error) {

        console.log(error);

        return res.status(500).json({ message: "Internal server error" });

    }

}



export const getCourseById = async (req, res) => {

    try {

        const course = await Course.findById(req.params.id);

        if (!course) {

            return res.status(404).json({ message: "Course not found" });

        }

        return res.status(200).json({ message: "Course fetched successfully", course });

    } catch (error) {

        console.log(error);

        return res.status(500).json({ message: "Internal server error" });

    }

}



export const deleteCourse = async (req, res) => {

    try {

        const course = await Course.findByIdAndDelete(req.params.id, { new: true });

        if (!course) {

            return res.status(404).json({ message: "Course not found" });

        }

        return res.status(200).json({ message: "Course deleted successfully" });

    } catch (error) {

        console.log(error);

        return res.status(500).json({ message: "Internal server error" });

    }

}


// For lecture controller
export const createLecture = async (req, res) => {
    try {
        const { title } = req.body;
        const { courseId } = req.params;
        if (!title || !courseId) {
            return res.status(400).json({ message: "Title and courseId are required" });
        }
        const lecture = await Lecture.create({
            title
        });
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        course.lectures.push(lecture._id);
        await course.populate("lectures");
        await course.save();

        return res.status(200).json({ message: "Lecture created successfully", lecture });

    } catch (error) {
        console.log("createLecture error:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });

    }
}

// For lecture controller
export const getCourseLeacture = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course is not found" });
        }
        await course.populate("lectures");
        return res.status(200).json({ message: "Lecture fetched successfully", course });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// edit lecture
export const editLecture = async (req, res) => {
    try {
        const { title, isPreviewFree } = req.body;
        const { lectureId } = req.params;
        if (!lectureId) {
            return res.status(400).json({ message: "lectureId is required" });
        }
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        let videoUrl = lecture.videoUrl;
        if (req.file) {
            videoUrl = req.file.path;
        }
        lecture.title = title ?? lecture.title;
        lecture.videoUrl = videoUrl;
        lecture.isPreviewFree = isPreviewFree ?? lecture.isPreviewFree;
        await lecture.save();
        return res.status(200).json({ message: "Lecture updated successfully", lecture });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
// remove lecture
export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        if (!lectureId) {
            return res.status(400).json({ message: "LectureId is required" });
        }
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } });
        return res.status(200).json({ message: "Lecture removed successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
