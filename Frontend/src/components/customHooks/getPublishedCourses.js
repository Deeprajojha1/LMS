import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCourseData } from "../../redux/courseSlice";

const useGetPublishedCourses = () => {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);

    useEffect(() => {
        if (courseData?.length) {
            return;
        }

        const fetchCourses = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/courses/getpublished",
                    { withCredentials: true }
                );
                dispatch(setCourseData(response.data.courses));
            } catch (error) {
                console.log(
                    "Error fetching published courses:",
                    error.response?.data || error.message
                );
            }
        };

        fetchCourses();
    }, [dispatch, courseData]);
};

export default useGetPublishedCourses;