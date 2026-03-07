import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { setCourses } from "../../../redux/courseSlice";
import "react-toastify/dist/ReactToastify.css";
import "./CreateCourse.css";

const CreateCourse = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //  useState
    const [courseData, setCourseData] = useState({
        title: "",
        category: "",
    });

    const [loading, setLoading] = useState(false);

    // Function to refresh courses
    const refreshCourses = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/courses/getcreatercourses", {
                withCredentials: true
            });
            dispatch(setCourses(response.data.courses));
        } catch (error) {
            console.log("Error refreshing courses:", error);
        }
    };

    //  Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData((prev) => ({ ...prev, [name]: value }));
    };

    //  Submit Form (IMPORTANT: async)
    const handleSubmit = async (e) => {
        e.preventDefault();

        //  Validation
        if (!courseData.title.trim() || !courseData.category.trim()) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const result = await axios.post("http://localhost:3000/api/courses/create", courseData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true  // Add this line
            });

            console.log("Course Created Successfully ", result.data);
            
            // Success toast
            toast.success("Course created successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Clear Form
            setCourseData({ title: "", category: "" });

            // Refresh courses in Redux
            await refreshCourses();

            // Navigate after success
            navigate("/courses");
        } catch (error) {
            console.error("Error creating course ❌", error);
            
            // Error toast
            toast.error("Course creation failed!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="createCoursePage">
            <div className="createCourseContainer">
                {/*  Header */}
                <div className="createCourseHeader">
                    <div className="createCourseHeaderLeft">
                        <button className="backBtn" onClick={() => navigate("/courses")}>
                            <FaArrowLeftLong />
                        </button>
                        <h1 className="createCourseTitle">Create Course</h1>
                    </div>
                </div>

                {/* Form */}
                <form className="createCourseForm" onSubmit={handleSubmit}>
                    {/*  Title */}
                    <div className="formGroup">
                        <label className="formLabel" htmlFor="title">
                            Course Title
                        </label>
                        <input
                            className="formInput"
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter course title"
                            value={courseData.title}
                            onChange={handleChange}
                        />
                    </div>

                    {/*  Category */}
                    <div className="formGroup">
                        <label className="formLabel" htmlFor="category">
                            Course Category
                        </label>
                        <select
                            className="formSelect"
                            id="category"
                            name="category"
                            value={courseData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            <option value="App Development">App Development</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="AI Tools">AI Tools</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Ethical Hacking">Ethical Hacking</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="UI/UX Designing">UI/UX Designing</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="buttonGroup">
                        <button type="submit" className="submitBtn" disabled={loading}>
                            {loading ? <ClipLoader size={18} color="#ffffff" /> : "Create Course"}
                        </button>

                        <button
                            type="button"
                            className="cancelBtn"
                            onClick={() => navigate("/courses")}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
