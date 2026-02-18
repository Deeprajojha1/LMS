import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../../redux/lectureSlice";
import "./EditLecture.css";

const EditLecture = () => {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChooseVideo = () => fileInputRef.current?.click();

  useEffect(() => {
    const fetchLecture = async () => {
      if (!courseId || !lectureId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/getcourselecture/${courseId}`,
          { withCredentials: true }
        );

        const lectures = response?.data?.course?.lectures || [];
        dispatch(setLectureData(Array.isArray(lectures) ? lectures : []));
        const currentLecture = Array.isArray(lectures)
          ? lectures.find((item) => item?._id === lectureId)
          : null;

        if (!currentLecture) {
          toast.error("Lecture not found");
          navigate(`/create-lecture/${courseId}`);
          return;
        }

        setTitle(currentLecture?.title || "");
        setCurrentVideoUrl(currentLecture?.videoUrl || "");
        setIsPreviewFree(Boolean(currentLecture?.isPreviewFree));
      } catch (error) {
        toast.error("Failed to load lecture");
        console.error(error);
      }
    };

    fetchLecture();
  }, [courseId, lectureId, navigate, dispatch]);

  const handleUpdateLecture = async () => {
    if (!title.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("isPreviewFree", String(isPreviewFree));

      if (videoFile) {
        formData.append("video", videoFile);
      }

      const response = await axios.post(
        `http://localhost:3000/api/courses/editlecture/${lectureId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedLecture = response?.data?.lecture;
      if (updatedLecture) {
        const currentLectures = Array.isArray(lectureData) ? lectureData : [];
        const nextLectures = currentLectures.map((item) =>
          item?._id === lectureId ? { ...item, ...updatedLecture } : item
        );
        dispatch(setLectureData(nextLectures));
        setCurrentVideoUrl(updatedLecture?.videoUrl || "");
        setVideoFile(null);
      }

      toast.success(response?.data?.message || "Lecture updated successfully");
      // navigate(`/create-lecture/${courseId}`);
      navigate("/courses");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update lecture");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLecture = async () => {
    try {
      setDeleting(true);
      const response = await axios.delete(
        `http://localhost:3000/api/courses/removeteature/${lectureId}`,
        { withCredentials: true }
      );
      const currentLectures = Array.isArray(lectureData) ? lectureData : [];
      const nextLectures = currentLectures.filter((item) => item?._id !== lectureId);
      dispatch(setLectureData(nextLectures));
      toast.success(response?.data?.message || "Lecture removed successfully");
      navigate(`/create-lecture/${courseId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove lecture");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="editLecturePage">
      <div className="editLectureCard">
        <button
          type="button"
          className="editLectureBack"
          onClick={() => navigate(`/create-lecture/${courseId}`)}
        >
          <FaArrowLeft />
          Back
        </button>

        <h2 className="editLectureHeading">+ Update Course Lecture</h2>

        <button
          type="button"
          className="editLectureRemoveBtn"
          onClick={handleRemoveLecture}
          disabled={deleting}
        >
          {deleting ? "Removing..." : "Remove Lecture"}
        </button>

        <label className="editLectureLabel" htmlFor="lecture-title">
          Lecture Title
        </label>
        <input
          id="lecture-title"
          className="editLectureInput"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <label className="editLectureLabel" htmlFor="lecture-video">
          Video
        </label>
        <div className="editLectureFileRow">
          <button
            type="button"
            className="editLectureChooseBtn"
            onClick={handleChooseVideo}
            disabled={loading}
          >
            Choose File
          </button>
          <span className="editLectureChosenName" title={videoFile ? videoFile.name : currentVideoUrl || "No file chosen"}>
            {videoFile
              ? videoFile.name
              : currentVideoUrl || "No file chosen"}
          </span>
        </div>
        <input
          id="lecture-video"
          ref={fileInputRef}
          className="editLectureFileHidden"
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          disabled={loading}
        />

        <label className="editLectureCheckboxRow" htmlFor="lecture-free">
          <input
            id="lecture-free"
            type="checkbox"
            checked={isPreviewFree}
            onChange={(e) => setIsPreviewFree(e.target.checked)}
            disabled={loading}
          />
          <span>Is this Video FREE</span>
        </label>

        <button
          type="button"
          className="editLectureUpdateBtn"
          onClick={handleUpdateLecture}
          disabled={loading}
        >
          {loading ? <ClipLoader size={16} color="#ffffff" /> : "Update Lecture"}
        </button>
      </div>
    </div>
  );
};

export default EditLecture;
