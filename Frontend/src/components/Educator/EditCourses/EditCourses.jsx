import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditCourses.css";

const DEFAULT_THUMBNAIL_URL =
  "https://imgs.search.brave.com/EFAWwE1HPAIIJN8DKk8IZvtgUUKPnaDKmb4918iHruI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTYy/MzMwMzc3MC9waG90/by9jcmVhdGl2ZS1i/YWNrZ3JvdW5kLWlt/YWdlLWlzLWJsdXJy/ZWQtZXZlbmluZy1j/aXR5LWxpZ2h0cy1h/bmQtbGlnaHQtc25v/d2ZhbGwuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVl4WDIt/aWxYVVcyOTJoZGU4/bEhiRjRHaU1pMkNB/alRkR1ZfUGtlQmgz/R1E9";

const EditCourses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isPublished, setIsPublished] = useState(false);

  const thum = useRef(null);

  const [courseData, setCourseData] = useState({
    title: "",
    subTitle: "",
    description: "",
    category: "",
    level: "",
    price: "",
    thumbnail: "", //  can be URL or File
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to refresh courses
  const refreshCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/courses/getcreatercourses", {
        withCredentials: true
      });
      dispatch({ type: "course/setCourses", payload: response.data.courses });
    } catch (error) {
      console.log("Error refreshing courses:", error);
    }
  };

  //  FETCH COURSE DATA (POST)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/getcourse/${id}`,
          { withCredentials: true }
        );

        const course = response.data.course;

        setCourseData({
          title: course.title || "",
          subTitle: course.subTitle || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "",
          price: course.price || "",
          thumbnail: course.thumnail || "", //  url from DB
        });

        setIsPublished(course.isPublished || false);
        setThumbnailPreview(course.thumnail || "");
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch course data ❌");
      }
    };

    fetchCourse();
  }, [id]);

  //  Preview cleanup
  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  //  Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  //  Thumbnail change (preview + store file)
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);

    setCourseData((prev) => ({ ...prev, thumbnail: file }));
  };

  //  SAVE ALL DATA TO BACKEND (POST + FormData)
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      //  req.body fields
      formData.append("title", courseData.title);
      formData.append("subTitle", courseData.subTitle);
      formData.append("description", courseData.description);
      formData.append("category", courseData.category);
      formData.append("level", courseData.level);
      formData.append("price", courseData.price);
      formData.append("isPublished", isPublished);

      //  req.file field (only if new file selected)
      if (courseData.thumbnail instanceof File) {
        formData.append("thumnail", courseData.thumbnail);
      }

      const res = await axios.post(
        `http://localhost:3000/api/courses/edit/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Course updated successfully");

      // Refresh courses in Redux
      await refreshCourses();

      // Navigate back to Courses page after successful update
      navigate("/courses");

      const updatedCourse = res.data.course;

      //  Update UI with new thumbnail URL (cloudinary)
      if (updatedCourse?.thumbnail) {
        setThumbnailPreview(updatedCourse.thumbnail);
        setCourseData((prev) => ({
          ...prev,
          thumbnail: updatedCourse.thumbnail,
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Course update failed ❌");
    } finally {
      setLoading(false);
    }
  };
  
  //  DELETE COURSE BY ID
  const deleteCourseByid = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`http://localhost:3000/api/courses/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Course deleted successfully");
      navigate("/courses");
    } catch (error) {
      console.log(error);
      toast.error("Course deletion failed ❌");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="editCoursePage">
      <div className="editCourseContainer">
        {/*  Top Bar */}
        <div className="editCourseTopbar">
          <div className="topbarLeft">
            <button
              className="iconBtn"
              onClick={() => navigate("/courses")}
              title="Back"
              type="button"
            >
              <FaArrowLeft />
            </button>

            <div className="topbarText">
              <h1 className="pageTitle">Edit Course</h1>
              <p className="pageSubTitle">
                Add Detail Information Regarding the Course
              </p>
            </div>
          </div>

          <div className="topbarRight">
            <button className="btnOutline" type="button" onClick={() => navigate(`/create-lecture/${id}`)}>
              Go to Lecture Pages
            </button>
          </div>
        </div>

        {/*  Content */}
        <div className="editCourseContent">
          {/*  Left = Form */}
          <div className="editCourseFormCard">
            <div className="cardHeader">
              <h2 className="sectionTitle">Basic Course Information</h2>

              <div className="actionRow">
                {!isPublished ? (
                  <button
                    className="btnPrimary"
                    onClick={() => setIsPublished((prev) => !prev)}
                    type="button"
                  >
                    Click to Publish
                  </button>
                ) : (
                  <button
                    className="btnPrimary"
                    onClick={() => setIsPublished((prev) => !prev)}
                    type="button"
                  >
                    Click to Unpublish
                  </button>
                )}

                <button className="btnDanger" type="button" onClick={()=>{deleteCourseByid(id)}}>
                  Remove Course
                </button>
              </div>
            </div>

            <form className="editForm" onSubmit={handleSave}>
              {/* Title */}
              <div className="formGroup">
                <label className="formLabel" htmlFor="title">
                  Course Title
                </label>
                <input
                  className="formInput"
                  type="text"
                  id="title"
                  name="title"
                  value={courseData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                />
              </div>

              {/* Subtitle */}
              <div className="formGroup">
                <label className="formLabel" htmlFor="subTitle">
                  Sub Title
                </label>
                <input
                  className="formInput"
                  id="subTitle"
                  name="subTitle"
                  value={courseData.subTitle}
                  onChange={handleChange}
                  placeholder="Enter sub title"
                />
              </div>

              {/* Description */}
              <div className="formGroup">
                <label className="formLabel" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="formTextarea"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  value={courseData.description}
                  onChange={handleChange}
                />
              </div>

              {/*  Flex Row */}
              <div className="formRow">
                {/* Category */}
                <div className="formGroup">
                  <label className="formLabel" htmlFor="category">
                    Category
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

                {/* Level */}
                <div className="formGroup">
                  <label className="formLabel" htmlFor="level">
                    Level
                  </label>
                  <select
                    className="formSelect"
                    id="level"
                    name="level"
                    value={courseData.level}
                    onChange={handleChange}
                  >
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Price */}
                <div className="formGroup">
                  <label className="formLabel" htmlFor="price">
                    Course Price <MdCurrencyRupee /> INR
                  </label>
                  <input
                    className="formInput"
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter price"
                    value={courseData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/*  Thumbnail Upload */}
              <div className="formGroup">
                <label className="formLabel" htmlFor="thumbnail">
                  Thumbnail
                </label>

                <div className="thumbnailRow">
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    hidden
                    ref={thum}
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />

                  <button
                    type="button"
                    className="btnOutline"
                    onClick={() => thum.current?.click()}
                  >
                    Upload Image
                  </button>

                  <p className="helperText">
                    Choose a file to update thumbnail
                  </p>
                </div>
              </div>

              {/*  Buttons */}
              <div className="formFooter">
                <button
                  type="button"
                  className="btnOutline"
                  onClick={() => navigate("/courses")}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button type="submit" className="btnPrimary" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>

          {/*  Right Preview */}
          <div className="editCoursePreviewCard">
            <h3 className="sectionTitle">Course Thumbnail</h3>

            <div className="thumbPreviewWrap">
              <img
                className="thumbPreview"
                src={thumbnailPreview || DEFAULT_THUMBNAIL_URL}
                alt="Course thumbnail"
                onClick={() => thum.current?.click()}
              />
              <p className="thumbHint">Click image to change thumbnail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourses;
