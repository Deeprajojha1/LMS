import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    } ,
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner"
    },
    thumnail: {
        type: String,
       
    },
    enroledStudents: [{
       type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

export const Course = mongoose.model("Course", courseSchema);
