import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData, setUserLoading } from "../../redux/userSlice";

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchUser = async () => {
            dispatch(setUserLoading(true));

            // Restore cached user immediately so role-based UI does not disappear on refresh.
            try {
                const cachedUser = localStorage.getItem("lms_user");
                if (cachedUser) {
                    dispatch(setUserData(JSON.parse(cachedUser)));
                }
            } catch (cacheError) {
                console.log("Failed to read cached user:", cacheError.message);
            }

            try {
                const res = await axios.get("http://localhost:3000/api/users/me", {
                    withCredentials: true,
                });
                dispatch(setUserData(res.data.user));
                localStorage.setItem("lms_user", JSON.stringify(res.data.user));

            } catch (error) {
                console.log("Get Current User Error:", error.response?.data || error.message);
                const status = error.response?.status;

                // Clear user only when auth is actually invalid.
                if ([400, 401, 403].includes(status)) {
                    dispatch(setUserData(null));
                    localStorage.removeItem("lms_user");
                }
            } finally {
                dispatch(setUserLoading(false));
            }
        };
        fetchUser();

    }, [dispatch]);
};

export default useGetCurrentUser;
