// src/pages/FavoritesPage.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useMovieStore();

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-white flex items-center gap-3">
              <Heart className="w-8 h-8 fill-primary text-primary" />
              My Favorites
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
            </p>
          </div>
        </motion.div>

        {/* Empty state */}
        {favorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center py-24 gap-5 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-muted/50 border border-border flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
              <p className="text-muted-foreground text-sm max-w-xs">
                Browse movies and click the heart icon to add them to your favorites list.
              </p>
            </div>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="rounded-full px-6 mt-2"
            >
              Browse Movies
            </Button>
          </motion.div>
        )}

        {/* Favorites grid */}
        {favorites.length > 0 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
          >
            <AnimatePresence>
              {favorites.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  layout
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
