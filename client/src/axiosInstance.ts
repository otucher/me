import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NODE_ENV === "production" ?
    `${window.location.origin}/api`
    : 'http://localhost:8000/api',
  timeout: 5000,
});

export default instance;
