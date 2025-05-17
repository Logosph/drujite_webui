import axios from "axios";

const BASE_URL = "http://89.208.87.216:8080";

const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match ? match[2] : null;
};


const instance = axios.create({
    baseURL: BASE_URL
});

const concatUrl = (additionUrl: string, usePrefix: boolean): string => {
    let url = BASE_URL;
    if (usePrefix) {
        url += "/api/v1";
    }
    url += additionUrl;
    return url;
}

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
export {concatUrl};