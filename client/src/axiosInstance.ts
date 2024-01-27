import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://production-api.example.com'
    : 'http://localhost:8000',
  timeout: 5000,
});

export default instance
