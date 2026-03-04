import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCourses } from "../../redux/courseSlice";

export const useGetCreatorCourse = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);
    
    useEffect(() => {
        if (!userData) return;
        if (userData?.role !== "educator") return;

        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/courses/getcreatercourses"
                    ,{withCredentials: true}
                );
                console.log(response.data);
                dispatch(setCourses(response.data.courses));
               
            } catch (error) {
                console.log(error);
            }
        };
        fetchCourses();
    }, [dispatch, userData]);
};
