// src/types/movie.ts

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  homepage: string | null;
  imdb_id: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  results: Video[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchParams {
  query: string;
  page?: number;
}

// Zod schema types (used in SearchForm)
export interface SearchFormData {
  query: string;
}
