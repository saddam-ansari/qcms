import axios from "axios";


// Create axios instance
const api = axios.create({
    baseURL: "http://localhost:4000/api"
});

// Add token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || "";
        if (error.response?.status === 401 && !requestUrl.startsWith("/auth/")) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("name");
            window.dispatchEvent(new Event("auth:expired"));
        }
        return Promise.reject(error);
    }
);


export default api;