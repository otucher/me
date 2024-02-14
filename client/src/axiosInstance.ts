import axios from "axios";

const apiUrl = process.env.NODE_ENV === "production" ? `${window.location.origin}/api` : "http://localhost:8000/api";

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

export default instance;
