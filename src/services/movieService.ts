// src/services/movieService.ts
import { tmdbAxios } from '@/lib/axios';
import type {
  Movie,
  MovieDetail,
  Credits,
  VideosResponse,
  PaginatedResponse,
} from '@/types/movie';

// ─── Trending & Popular ────────────────────────────────────────────────────

export const fetchTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdbAxios.get<PaginatedResponse<Movie>>(
    `/trending/movie/${timeWindow}`
  );
  return data;
};

export const fetchPopularMovies = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdbAxios.get<PaginatedResponse<Movie>>('/movie/popular', {
    params: { page },
  });
  return data;
};

export const fetchNowPlayingMovies = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdbAxios.get<PaginatedResponse<Movie>>('/movie/now_playing', {
    params: { page },
  });
  return data;
};

export const fetchTopRatedMovies = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdbAxios.get<PaginatedResponse<Movie>>('/movie/top_rated', {
    params: { page },
  });
  return data;
};

export const fetchUpcomingMovies = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdbAxios.get<PaginatedResponse<Movie>>('/movie/upcoming', {
    params: { page },
  });
  return data;
};

// ─── Movie Detail ──────────────────────────────────────────────────────────

export const fetchMovieDetail = async (movieId: number): Promise<MovieDetail> => {
  const { data } = await tmdbAxios.get<MovieDetail>(`/movie/${movieId}`);
  return data;
};

export const fetchMovieCredits = async (movieId: number): Promise<Credits> => {
  const { data } = await tmdbAxios.get<Credits>(`/movie/${movieId}/credits`);
  return data;
};

export const fetchMovieVideos = async (movieId: number): Promise<VideosResponse> => {
  const { data } = await tmdbAxios.get<VideosResponse>(`/movie/${movieId}/videos`);
  return data;
};

export const fetchSimilarMovies = async (movieId: number, page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdbAxios.get<PaginatedResponse<Movie>>(
    `/movie/${movieId}/similar`,
    { params: { page } }
  );
  return data;
};

// ─── Search ────────────────────────────────────────────────────────────────

export const searchMovies = async (query: string, page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdbAxios.get<PaginatedResponse<Movie>>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
};
