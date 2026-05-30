// src/pages/SearchPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchMovies } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorMessage from '@/components/ErrorMessage';

const searchSchema = z.object({
  query: z.string().min(1, 'Enter at least 1 character'),
});
type SearchForm = z.infer<typeof searchSchema>;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState<any[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: initialQuery },
  });

  const { data, isLoading, isError, isFetching } = useSearchMovies(activeQuery, page);

  // Accumulate pages
  useEffect(() => {
    if (page === 1) setAllResults(data?.results ?? []);
    else if (data?.results) setAllResults((prev) => [...prev, ...data.results]);
  }, [data, page]);

  // Reset when query changes
  useEffect(() => {
    setPage(1);
    setAllResults([]);
  }, [activeQuery]);

  // Sync URL → form
  useEffect(() => {
    setValue('query', initialQuery);
    setActiveQuery(initialQuery);
  }, [initialQuery, setValue]);

  const onSubmit = (form: SearchForm) => {
    setSearchParams({ q: form.query });
    setActiveQuery(form.query);
    setPage(1);
  };

  const hasMore = data ? data.page < data.total_pages : false;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="flex items-center bg-muted border border-border rounded-full px-4 py-3 gap-3 focus-within:border-primary/50 transition-colors">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                {...register('query')}
                placeholder="Search for movies..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              />
              {watch('query') && (
                <button
                  type="button"
                  onClick={() => { setValue('query', ''); setSearchParams({}); setActiveQuery(''); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.query && (
              <p className="text-red-400 text-xs mt-2 px-4">{errors.query.message}</p>
            )}
          </form>
        </motion.div>

        {/* Results header */}
        {activeQuery && (
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {isLoading ? 'Searching...' : (
                data?.total_results
                  ? `${data.total_results.toLocaleString()} results for "${activeQuery}"`
                  : `No results for "${activeQuery}"`
              )}
            </h1>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4 mt-2 rounded" />
                <Skeleton className="h-2 w-1/2 mt-1 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && <ErrorMessage message="Search failed. Please try again." />}

        {/* Results grid */}
        {!isLoading && allResults.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
            >
              <AnimatePresence>
                {allResults.map((movie, i) => (
                  <motion.div
                    key={`${movie.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i < 10 ? i * 0.04 : 0 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isFetching}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                >
                  {isFetching ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isLoading && !isError && activeQuery && allResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20 gap-4 text-center"
          >
            <Search className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">No movies found for "{activeQuery}"</p>
            <p className="text-sm text-muted-foreground/60">Try a different search term</p>
          </motion.div>
        )}

        {/* Initial state */}
        {!activeQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20 gap-4 text-center"
          >
            <Search className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Search for your favorite movies</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
