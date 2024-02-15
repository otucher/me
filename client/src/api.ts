import axios from "axios";

const apiUrl = process.env.NODE_ENV === "production"
  ? "http://server.resume"
  : "http://localhost:80";

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

export default instance;
