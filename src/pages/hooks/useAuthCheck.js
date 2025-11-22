import { useEffect } from "react";
import useFetch from "./useFetch";
import { useDispatch } from "react-redux";
import { setAuth, clearAuth } from "../../store/auth/authSlice";

export default function useAuthCheck() {
  const dispatch = useDispatch();

  const { data, error, fetchData } = useFetch("/user/me", "GET", false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data?.user) {
      dispatch(
        setAuth({
          token: "cookies",
          user: data?.data
        })
      );
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      dispatch(clearAuth());
    }
  }, [error]);
}
