import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const appendQueryParams = (url, queryParams) => {
    if (!queryParams) return url;
    const queryString = new URLSearchParams(queryParams).toString();
    return `${url}?${queryString}`;
};

const apiUrl = "http://localhost:8080/course-tracker-api";//process.env.REACT_APP_COURSE_TRACKER_API_URL;

const useFetch = (url, method, autoFetch = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { token } = useSelector((state) => state.auth);

    url = apiUrl + url;

    useEffect(() => {
        if (autoFetch) fetchData();
    }, [autoFetch, method, url]);

    const fetchData = useCallback(
        async (body, queryParams) => {
            const finalUrl = appendQueryParams(url, queryParams);

            const config = { 
                method, 
                url: finalUrl, 
                withCredentials: true 
            };

            setData(null);
            setError(null);

            try {
                setLoading(true);
                if (body) config.data = body;

                const response = await axios(config);
                setData(response.data);
                setError("");
            } catch (err) {
                setError(err.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        },
        [url, method]
    );

    return { data, loading, error, fetchData };
};

export default useFetch;
