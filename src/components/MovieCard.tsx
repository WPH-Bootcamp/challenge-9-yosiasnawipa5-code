// src/components/MovieCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ImageOff } from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { getImageUrl } from '@/lib/axios';
import { formatRating } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  className?: string;
}

export default function MovieCard({ movie, rank, className }: MovieCardProps) {
  const { toggleFavorite, isFavorite } = useMovieStore();
  const fav = isFavorite(movie.id);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn('group relative flex flex-col', className)}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted border border-border/50">
          {/* Rank badge */}
          {rank !== undefined && (
            <div className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center">
              <span className="text-[11px] font-bold text-white">{rank}</span>
            </div>
          )}

          {/* Poster image */}
          {!imgError && movie.poster_path ? (
            <img
              src={getImageUrl(movie.poster_path, 'w342')}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageOff className="w-8 h-8" />
              <span className="text-xs px-2 text-center">{movie.title}</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 rounded-xl" />

          {/* Rating chip on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-white">{formatRating(movie.vote_average)}/10</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Info + Favorite */}
      <div className="mt-2.5 flex items-start justify-between gap-1 px-0.5">
        <Link to={`/movie/${movie.id}`} className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{formatRating(movie.vote_average)}/10</span>
          </div>
        </Link>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(movie);
          }}
          className={cn(
            'p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shrink-0',
            fav
              ? 'text-primary'
              : 'text-muted-foreground hover:text-primary'
          )}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('w-4 h-4', fav && 'fill-primary')} />
        </button>
      </div>
    </motion.div>
  );
}
