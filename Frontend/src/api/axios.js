import axios from 'axios';

const API = axios.create({
  baseURL: 'https://resume-analyzer-yzft.onrender.com',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default API;
