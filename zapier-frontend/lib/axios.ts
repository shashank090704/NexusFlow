import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"; // ✅ backend port

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 🔥 Attach JWT to every request
/* pehle kar rhe the ye jab localstorage mai token tha  ab cookies mai hai
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);*/
