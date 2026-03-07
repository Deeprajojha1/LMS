

import { Course } from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import Review from "../models/reviewModel.js";

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

        const courses = await Course.find({ isPublished: true }).populate('lectures');
        const courseIds = courses.map((course) => course._id);

        const reviewStats = await Review.aggregate([
            { $match: { course: { $in: courseIds } } },
            {
                $group: {
                    _id: "$course",
                    averageRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);

        const reviewMap = new Map(
            reviewStats.map((stat) => [
                stat._id.toString(),
                {
                    averageRating: Number((stat.averageRating || 0).toFixed(1)),
                    reviewCount: stat.reviewCount || 0,
                },
            ])
        );

        const coursesWithReviewStats = courses.map((course) => {
            const stats = reviewMap.get(course._id.toString()) || {
                averageRating: 0,
                reviewCount: 0,
            };

            return {
                ...course.toObject(),
                averageRating: stats.averageRating,
                reviewCount: stats.reviewCount,
            };
        });

        return res.status(200).json({ message: "Courses fetched successfully", courses: coursesWithReviewStats });

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

// add or update course review
export const addOrUpdateCourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    const parsedRating = Number(rating);
    const trimmedComment = typeof comment === "string" ? comment.trim() : "";

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!trimmedComment) {
      return res.status(400).json({ message: "Review comment is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let review = await Review.findOne({ course: courseId, user: req.userId });

    if (review) {
      review.rating = parsedRating;
      review.comment = trimmedComment;
      await review.save();
    } else {
      review = await Review.create({
        course: courseId,
        user: req.userId,
        rating: parsedRating,
        comment: trimmedComment,
      });
    }

    const reviewId = review._id.toString();
    const courseReviewIds = (course.reviews || []).map((item) => item.toString());
    if (!courseReviewIds.includes(reviewId)) {
      course.reviews.push(review._id);
      await course.save();
    }

    const populatedReview = await Review.findById(review._id).populate("user", "name photoUrl role");

    return res.status(200).json({
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.log("addOrUpdateCourseReview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// get course reviews
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const courseExists = await Course.exists({ _id: courseId });
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name photoUrl role")
      .sort({ reviewdAt: -1 });

    const reviewCount = reviews.length;
    const averageRating = reviewCount
      ? Number((reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0) / reviewCount).toFixed(1))
      : 0;

    return res.status(200).json({
      message: "Course reviews fetched successfully",
      reviews,
      averageRating,
      reviewCount,
    });
  } catch (error) {
    console.log("getCourseReviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
