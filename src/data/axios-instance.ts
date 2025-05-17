import axios from "axios";

const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match ? match[2] : null;
};


const instance = axios.create({
    baseURL: "http://89.208.87.216:8080"
});

instance.interceptors.request.use((config) => {
    const token = getTokenFromCookie();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/signup" &&
            error.response &&
            error.response.status === 401
        ) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default instance;
