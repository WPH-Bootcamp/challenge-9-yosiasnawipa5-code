// src/pages/HomePage.tsx
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import TrendingRow from '@/components/TrendingRow';
import MovieGrid from '@/components/MovieGrid';
import ErrorMessage from '@/components/ErrorMessage';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useTrendingMovies,
  useInfiniteNowPlaying,
} from '@/hooks/useMovies';

export default function HomePage() {
  const {
    data: trendingData,
    isLoading: trendingLoading,
    isError: trendingError,
    refetch: refetchTrending,
  } = useTrendingMovies('week');

  const {
    data: nowPlayingData,
    isLoading: nowPlayingLoading,
    isError: nowPlayingError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchNowPlaying,
  } = useInfiniteNowPlaying();

  const trendingMovies = trendingData?.results ?? [];
  const heroMovie = trendingMovies[0];

  const nowPlayingMovies = nowPlayingData?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      {trendingLoading || !heroMovie ? (
        <div className="relative w-full h-[90vh] sm:h-[85vh] min-h-[520px] max-h-[820px] bg-muted animate-pulse" />
      ) : trendingError ? (
        <div className="h-[50vh] flex items-center justify-center">
          <ErrorMessage
            title="Failed to load hero"
            message="Could not load featured movie. Check your TMDB API key."
            onRetry={() => refetchTrending()}
          />
        </div>
      ) : (
        <HeroSection movie={heroMovie} />
      )}

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-14 sm:space-y-16">

        {/* Trending Now */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-10 sm:pt-14"
        >
          {trendingError ? (
            <ErrorMessage
              message="Failed to load trending movies."
              onRetry={() => refetchTrending()}
            />
          ) : (
            <TrendingRow
              title="Trending Now"
              movies={trendingMovies}
              isLoading={trendingLoading}
              showRank={true}
            />
          )}
        </motion.section>

        {/* New Release */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {nowPlayingError ? (
            <ErrorMessage
              message="Failed to load new releases."
              onRetry={() => refetchNowPlaying()}
            />
          ) : (
            <MovieGrid
              title="New Release"
              movies={nowPlayingMovies}
              isLoading={nowPlayingLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              onLoadMore={() => fetchNextPage()}
            />
          )}
        </motion.section>
      </main>
    </div>
  );
}
