// src/hooks/useMovies.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchMovieDetail,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchSimilarMovies,
  searchMovies,
} from '@/services/movieService';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const movieKeys = {
  all: ['movies'] as const,
  trending: (tw: string) => [...movieKeys.all, 'trending', tw] as const,
  popular: (page: number) => [...movieKeys.all, 'popular', page] as const,
  nowPlaying: (page: number) => [...movieKeys.all, 'nowPlaying', page] as const,
  topRated: (page: number) => [...movieKeys.all, 'topRated', page] as const,
  upcoming: (page: number) => [...movieKeys.all, 'upcoming', page] as const,
  detail: (id: number) => [...movieKeys.all, 'detail', id] as const,
  credits: (id: number) => [...movieKeys.all, 'credits', id] as const,
  videos: (id: number) => [...movieKeys.all, 'videos', id] as const,
  similar: (id: number) => [...movieKeys.all, 'similar', id] as const,
  search: (query: string, page: number) => [...movieKeys.all, 'search', query, page] as const,
};

// ─── Home Page Hooks ─────────────────────────────────────────────────────────

export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'week') =>
  useQuery({
    queryKey: movieKeys.trending(timeWindow),
    queryFn: () => fetchTrendingMovies(timeWindow),
    staleTime: 1000 * 60 * 10, // 10 min
  });

export const usePopularMovies = (page = 1) =>
  useQuery({
    queryKey: movieKeys.popular(page),
    queryFn: () => fetchPopularMovies(page),
    staleTime: 1000 * 60 * 5,
  });

export const useNowPlayingMovies = (page = 1) =>
  useQuery({
    queryKey: movieKeys.nowPlaying(page),
    queryFn: () => fetchNowPlayingMovies(page),
    staleTime: 1000 * 60 * 5,
  });

export const useTopRatedMovies = (page = 1) =>
  useQuery({
    queryKey: movieKeys.topRated(page),
    queryFn: () => fetchTopRatedMovies(page),
    staleTime: 1000 * 60 * 15,
  });

export const useUpcomingMovies = (page = 1) =>
  useQuery({
    queryKey: movieKeys.upcoming(page),
    queryFn: () => fetchUpcomingMovies(page),
    staleTime: 1000 * 60 * 5,
  });

// ─── Infinite Scroll for New Releases ────────────────────────────────────────

export const useInfiniteNowPlaying = () =>
  useInfiniteQuery({
    queryKey: [...movieKeys.all, 'nowPlaying', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchNowPlayingMovies(pageParam as number),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

// ─── Detail Page Hooks ────────────────────────────────────────────────────────

export const useMovieDetail = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => fetchMovieDetail(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 30,
  });

export const useMovieCredits = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.credits(movieId),
    queryFn: () => fetchMovieCredits(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 30,
  });

export const useMovieVideos = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.videos(movieId),
    queryFn: () => fetchMovieVideos(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 30,
  });

export const useSimilarMovies = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.similar(movieId),
    queryFn: () => fetchSimilarMovies(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10,
  });

// ─── Search Hook ──────────────────────────────────────────────────────────────

export const useSearchMovies = (query: string, page = 1) =>
  useQuery({
    queryKey: movieKeys.search(query, page),
    queryFn: () => searchMovies(query, page),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
