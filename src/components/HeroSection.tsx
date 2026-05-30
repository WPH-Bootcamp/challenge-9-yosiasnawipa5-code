// src/components/HeroSection.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBackdropUrl } from '@/lib/axios';
import { formatYear, formatRating } from '@/lib/utils';
import type { Movie } from '@/types/movie';

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const navigate = useNavigate();
  const backdropUrl = getBackdropUrl(movie.backdrop_path);

  return (
    <div className="relative w-full h-[90vh] sm:h-[85vh] min-h-[520px] max-h-[820px] overflow-hidden">
      {/* Backdrop Image */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x1080/1a1a1a/333333?text=No+Image';
          }}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-16 sm:pb-20 px-4 sm:px-6 lg:px-16 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl lg:max-w-2xl"
        >
          {/* Rating badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="inline-flex items-center gap-1 bg-primary/20 border border-primary/30 text-primary text-xs font-semibold px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-primary" />
              {formatRating(movie.vote_average)}/10
            </span>
            {movie.release_date && (
              <span className="text-muted-foreground text-xs">{formatYear(movie.release_date)}</span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4"
          >
            {movie.title}
          </motion.h1>

          {/* Overview */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 line-clamp-3"
          >
            {movie.overview}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Button
              onClick={() => navigate(`/movie/${movie.id}#trailer`)}
              size="lg"
              className="bg-primary hover:bg-red-700 text-white font-semibold rounded-full px-6 shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Trailer
            </Button>
            <Button
              onClick={() => navigate(`/movie/${movie.id}`)}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Info className="w-4 h-4" />
              See Detail
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
