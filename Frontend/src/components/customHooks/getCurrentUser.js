import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData, setUserLoading } from "../../redux/userSlice";

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchUser = async () => {
            dispatch(setUserLoading(true));
            try {
                const res = await axios.get("http://localhost:3000/api/users/me", {
                    withCredentials: true,
                });
                dispatch(setUserData(res.data.user))

            } catch (error) {
                console.log("Get Current User Error:", error.response?.data || error.message);
                dispatch(setUserData(null));
            } finally {
                dispatch(setUserLoading(false));
            }
        };
        fetchUser();

    }, [dispatch]);
};

export default useGetCurrentUser;
