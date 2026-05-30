// src/store/useMovieStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/types/movie';

interface MovieStore {
  // Favorites
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  toggleFavorite: (movie: Movie) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Sort/Filter
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      // ── Favorites ──────────────────────────────────────────────
      favorites: [],

      addFavorite: (movie) =>
        set((state) => ({
          favorites: state.favorites.some((f) => f.id === movie.id)
            ? state.favorites
            : [...state.favorites, movie],
        })),

      removeFavorite: (movieId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== movieId),
        })),

      isFavorite: (movieId) => get().favorites.some((f) => f.id === movieId),

      toggleFavorite: (movie) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(movie.id)) {
          removeFavorite(movie.id);
        } else {
          addFavorite(movie);
        }
      },

      // ── Search ─────────────────────────────────────────────────
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // ── Sort ───────────────────────────────────────────────────
      sortBy: 'popularity.desc',
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: 'movie-explorer-storage',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
