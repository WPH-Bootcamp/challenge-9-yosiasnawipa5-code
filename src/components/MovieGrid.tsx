// src/components/MovieGrid.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Movie } from '@/types/movie';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MovieGrid({
  title,
  movies,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: MovieGridProps) {
  return (
    <section className="w-full">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold text-white mb-5"
      >
        {title}
      </motion.h2>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-3 w-3/4 mt-2 rounded" />
              <Skeleton className="h-2 w-1/2 mt-1 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
          >
            <AnimatePresence>
              {movies.map((movie) => (
                <motion.div key={movie.id} variants={itemVariants} layout>
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More */}
          {(hasNextPage || onLoadMore) && (
            <div className="flex justify-center mt-10">
              <Button
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-border hover:bg-muted text-foreground min-w-[140px]"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
