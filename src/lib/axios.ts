// src/lib/axios.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

export const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
  timeout: 10000,
});

tmdbAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('TMDB API: Invalid API key. Please check your .env file.');
    } else if (error.response?.status === 404) {
      console.error('TMDB API: Resource not found.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('TMDB API: Request timeout.');
    }
    return Promise.reject(error);
  }
);

// Image URL helpers
export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null): string => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${IMAGE_BASE_URL}/original${path}`;
};
