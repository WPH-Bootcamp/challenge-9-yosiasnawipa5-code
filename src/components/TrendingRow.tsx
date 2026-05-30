// src/components/TrendingRow.tsx
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Movie } from '@/types/movie';

interface TrendingRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  showRank?: boolean;
}

export default function TrendingRow({ title, movies, isLoading, showRank }: TrendingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl font-bold text-white"
        >
          {title}
        </motion.h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 border border-border flex items-center justify-center text-muted-foreground hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 border border-border flex items-center justify-center text-muted-foreground hover:text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[140px] sm:w-[160px]">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4 mt-2 rounded" />
                <Skeleton className="h-2 w-1/2 mt-1 rounded" />
              </div>
            ))
          : movies.map((movie, index) => (
              <div key={movie.id} className="shrink-0 w-[140px] sm:w-[160px] lg:w-[176px]">
                <MovieCard movie={movie} rank={showRank ? index + 1 : undefined} />
              </div>
            ))}
      </div>
    </section>
  );
}
