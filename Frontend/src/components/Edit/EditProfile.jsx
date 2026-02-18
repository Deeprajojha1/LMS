import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditProfile.css";

// ✅ IMPORTANT: import setUserData
import { setUserData } from "../../redux/userSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Prefill data
  useEffect(() => {
    if (userData) {
      setName(userData?.name || "");
      setDescription(userData?.description || "");
      setPreview(userData?.photoUrl || "");
    }
  }, [userData]);

  //  Photo preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  //  Save Profile
  const handleSave = async (e) => {
    e.preventDefault();

    //  Prevent double click double api call
    if (loading) return;

    if (!name.trim()) {
      toast.error("Name is required ❌");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (photo) {
        formData.append("photo", photo); // must match multer field name
      }

      //  Cookie based auth
      const res = await axios.put(
        "http://localhost:3000/api/users/profile",
        formData,
        { withCredentials: true } // must for cookie
      );

      //  avoid duplicate toasts
      toast.dismiss();
      toast.success(res.data?.message || "Profile updated ✅");

      // update redux
      dispatch(setUserData(res.data.user));

      // navigate
      navigate("/profile");
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("BACKEND MESSAGE:", error.response?.data);

      toast.dismiss();
      toast.error(error.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-card">
        <div className="edit-header">
          <h2>Edit Profile</h2>
          <p>Update your personal details and photo</p>
        </div>

        <form onSubmit={handleSave} className="edit-form">
          {/*  Photo Section */}
          <div className="photo-section">
            <div className="photo-preview">
              {preview ? (
                <img src={preview} alt="preview" />
              ) : (
                <div className="photo-fallback">
                  {userData?.name?.slice(0, 1)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="photo-actions">
              <label className="upload-btn">
                Change Photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>

              <p className="photo-hint">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/*  Name */}
          <div className="input-box">
            <label>Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div className="input-box">
            <label>Bio</label>
            <textarea
              value={description}
              placeholder="Write something about yourself..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="btn-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
