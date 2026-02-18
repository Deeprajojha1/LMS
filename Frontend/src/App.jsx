import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./components/Home/Home.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Login from "./components/Login/Login.jsx";
import Profile from "./components/UserProfile/Profile.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSelector } from "react-redux";
import useGetCurrentUser from "./components/customHooks/getCurrentUser.js";
import Forget from "./components/ForgetPassword/Forget.jsx";
import EditProfile from "./components/Edit/EditProfile.jsx";
import ExploreCouses from "./components/ExploreCouses/ExploreCouses.jsx";
import Dashboard from "./components/Educator/Dashboard/Dashboard.jsx";
import Courses from "./components/Educator/Courses/courses.jsx";
import CreateCourse from "./components/Educator/CreateCourses/CreateCourse.jsx";
import EditCourses from "./components/Educator/EditCourses/editCourses.jsx";
import { useGetCreatorCourse} from "./components/customHooks/getCreatorCourse.js";
import CreateLecture from "./components/Educator/CreateLectures/CreateLecture.jsx";
import EditLecture from "./components/Educator/EditLecture/EditLecture.jsx";
import Allcourses from "./pages/Allcourses.jsx";
import ViewCourses from "./components/ViewCourses/ViewCourses.jsx";
const App = () => {
  useGetCurrentUser();
  useGetCreatorCourse();
  const { userData, isUserLoading } = useSelector((state) => state.user);

  if (isUserLoading) {
    return null;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Home />} />

        {/*  If already logged in, prevent going to login/signup */}
        <Route
          path="/login"
          element={userData ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signUp"
          element={userData ? <Navigate to="/" /> : <SignUp />}
        />

        {/*  Protected Route */}
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login" />}
        />
      
      {/* {Forget Password} */}
       <Route
          path="/forgetPassword"
          element={<Forget />}
        />

        {/* edit Profile */}
         <Route
          path="/edit_profile"
          element={userData ? <EditProfile /> : <Navigate to="/login" />}
        />
        
        {/* Explore Courses */}
        <Route
          path="/explore_courses"
          element={userData ? <ExploreCouses /> : <Navigate to="/login" />}
        />
          {/* DashBoard */}
         <Route
          path="/dashboard"
          element={userData?.role === "educator" ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* Courses */}
        <Route
          path="/courses"
          element={userData?.role === "educator" ? <Courses /> : <Navigate to="/login" />}
        />
        {/* create courses */}
        <Route
          path="/create-course"
          element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to="/login" />}
        />
        {/* Edit Courses */}
        <Route
          path="/edit-course/:id"
          element={userData?.role === "educator" ? <EditCourses /> : <Navigate to="/login" />}
        />
        {/* All Courses */}
        <Route
          path="/all-courses"
          element={userData ? <Allcourses /> : <Navigate to="/login" />}
        />
        <Route
          path="/view-courses"
          element={userData ? <ViewCourses /> : <Navigate to="/login" />}
        />
        {/* crear lecture */}
        <Route
          path="/create-lecture/:courseId"
          element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-lecture/:courseId/:lectureId"
          element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={userData ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
