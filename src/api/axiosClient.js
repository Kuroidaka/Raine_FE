import axios from "axios";
import { API_BASE_URL, PREFIX } from "../config";

const axiosClient = axios.create({
  baseURL: API_BASE_URL + PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to insert auth token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: "Server Error" };
    }
  }
);

export default axiosClient;