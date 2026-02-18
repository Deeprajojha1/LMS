import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
    name: "course",
    initialState: {
        courses: null,
        courseData: null,
        selectedCourse: null,
    },
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload;
        },
        setCourseData: (state, action) => {
            state.courseData = action.payload;
        },
        setSelectedCourse: (state, action) => {
            state.selectedCourse = action.payload;
        }
    },
});

export const { setCourses, setCourseData, setSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;