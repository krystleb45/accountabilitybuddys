import axios from 'axios';

// Axios instance with caching enabled
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
});

// Add caching functionality
const cache = new Map();

axiosInstance.interceptors.request.use((config) => {
  const cachedResponse = cache.get(config.url);
  if (cachedResponse) {
    return Promise.resolve(cachedResponse);
  }
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  cache.set(response.config.url, response);
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
