import axios from "axios";

const apiUrl = process.env.NODE_ENV === "production"
  ? "http://server.resume/api"
  : "http://localhost:8000/api";
console.log("API URL", apiUrl);

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

export default instance;
