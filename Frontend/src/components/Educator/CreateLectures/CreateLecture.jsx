import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateLecture.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLectureData } from "../../../redux/lectureSlice";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const CreateLecture = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  useEffect(() => {
    const getCurrentCourseLectures = async () => {
      if (!courseId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/getcourselecture/${courseId}`,
          { withCredentials: true }
        );

        const lectures = response?.data?.course?.lectures || [];
        dispatch(setLectureData(Array.isArray(lectures) ? lectures : []));
      } catch (error) {
        console.error(error);
      }
    };

    getCurrentCourseLectures();
  }, [courseId, dispatch]);

  const handleCreateLecture = async () => {
    if (!title.trim()) {
      toast.error("Please enter lecture title");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/courses/createlecture/${courseId}`,
        { title },
        { withCredentials: true }
      );

      const createdLecture = response?.data?.lecture;
      if (createdLecture) {
        const currentLectures = Array.isArray(lectureData) ? lectureData : [];
        dispatch(setLectureData([...currentLectures, createdLecture]));
      }

      toast.success(response?.data?.message || "Lecture created successfully");
      setTitle("");
      // navigate("/courses");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create lecture");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createLecturePage">
      <div className="createLectureCard">
        <h1 className="createLectureTitle">Let&apos;s Add a Lecture</h1>
        <p className="createLectureSubTitle">
          Enter the title and add your video lectures to enhance your course
          content.
        </p>

        <input
          className="createLectureInput"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Introduction to Mern Stack"
        />

        <div className="createLectureActions">
          <button
            type="button"
            className="lectureBtn lectureBtnLight"
            onClick={() => navigate("/courses")}
          >
            <FaArrowLeft />
            Back to Course
          </button>

          <button
            type="button"
            className="lectureBtn lectureBtnDark"
            onClick={handleCreateLecture}
            disabled={loading}
          >
            <FaPlus />
            {loading ? <ClipLoader size={16} color="#ffffff" /> : "Create Lecture"}
          </button>
        </div>

        <div className="lectureItems">
          {(Array.isArray(lectureData) ? lectureData : []).map((lecture, index) => (
            <div className="lectureItem" key={lecture?._id || lecture?.title}>
              <span className="lectureIndex">{index + 1}</span>
              <span className="lectureTitleText">{lecture?.title || "Untitled Lecture"}</span>

              <div className="lectureActionGroup">
                <button
                  type="button"
                  className="lectureEditBtn"
                  title="Edit lecture"
                  onClick={() =>
                    navigate(`/edit-lecture/${courseId}/${lecture?._id}`)
                  }
                >
                  <FiEdit3 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* <p className="courseIdHint">Course ID: {courseId}</p> */}
      </div>
    </div>
  );
};

export default CreateLecture;
