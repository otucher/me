import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost.api',
  timeout: 5000,
});

export default instance
