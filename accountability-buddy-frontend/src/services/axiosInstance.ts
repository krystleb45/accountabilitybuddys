import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Default TTL (Time-to-Live) for cached responses in milliseconds (e.g., 5 minutes)
const DEFAULT_TTL = 5 * 60 * 1000;

// Axios instance with caching enabled
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache structure with TTL support
interface CacheEntry {
  data: AxiosResponse;
  expiry: number; // Timestamp when the cache entry expires
}

const cache = new Map<string, CacheEntry>();

// Utility function to generate a unique cache key
const generateCacheKey = (config: AxiosRequestConfig): string => {
  const { url, method, params } = config;
  return `${method || 'GET'}:${url}?${JSON.stringify(params || {})}`;
};

// Request Interceptor: Handle caching for GET requests
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.method?.toUpperCase() === 'GET') {
      const cacheKey = generateCacheKey(config);
      const cachedEntry = cache.get(cacheKey);

      if (cachedEntry && cachedEntry.expiry > Date.now()) {
        // Don't return the cached response here. Instead, let the request proceed and handle the cached response in the response interceptor.
        return config;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Store GET responses in the cache
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method?.toUpperCase() === 'GET') {
      const cacheKey = generateCacheKey(response.config);
      cache.set(cacheKey, {
        data: response,
        expiry: Date.now() + DEFAULT_TTL, // Set expiry based on TTL
      });
    }
    return response;
  },
  (error) => {
    console.error('Response Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Utility function to clear expired cache entries (optional cleanup mechanism)
const clearExpiredCache = (): void => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiry <= now) {
      cache.delete(key);
    }
  }
};

// Periodically clear expired cache entries
setInterval(clearExpiredCache, DEFAULT_TTL);

export default axiosInstance;
