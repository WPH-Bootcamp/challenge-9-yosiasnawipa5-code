// src/pages/MovieDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Globe,
  Heart,
  Play,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import MovieCard from '@/components/MovieCard';
import ErrorMessage from '@/components/ErrorMessage';
import {
  useMovieDetail,
  useMovieCredits,
  useMovieVideos,
  useSimilarMovies,
} from '@/hooks/useMovies';
import { useMovieStore } from '@/store/useMovieStore';
import { getImageUrl, getBackdropUrl } from '@/lib/axios';
import { formatRating, formatYear, formatRuntime, formatCurrency, cn } from '@/lib/utils';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { data: movie, isLoading, isError } = useMovieDetail(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: videos } = useMovieVideos(movieId);
  const { data: similar } = useSimilarMovies(movieId);

  const { toggleFavorite, isFavorite } = useMovieStore();
  const fav = movie ? isFavorite(movie.id) : false;

  // Find YouTube trailer
  const trailer = videos?.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  ) ?? videos?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');

  const director = credits?.crew.find((c) => c.job === 'Director');
  const topCast = credits?.cast.slice(0, 10) ?? [];
  const similarMovies = similar?.results.slice(0, 10) ?? [];

  if (isLoading) return <DetailSkeleton />;
  if (isError || !movie) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <ErrorMessage
        title="Movie not found"
        message="This movie could not be loaded."
        onRetry={() => navigate(-1)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          src={getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x1080/1a1a1a/333?text='; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 sm:left-6 lg:left-16 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      {/* Detail content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="-mt-48 sm:-mt-56 relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="shrink-0 w-44 sm:w-56 lg:w-72 mx-auto lg:mx-0"
          >
            <div className="rounded-2xl overflow-hidden border-2 border-border shadow-2xl shadow-black/60 aspect-[2/3]">
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750/1a1a1a/333?text=No+Poster'; }}
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-1 pt-4 lg:pt-32"
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres?.map((g) => (
                <Badge key={g.id} variant="secondary" className="text-xs">
                  {g.name}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-muted-foreground italic text-sm mb-4">"{movie.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-white">{formatRating(movie.vote_average)}</span>
                <span className="text-xs">({movie.vote_count.toLocaleString()})</span>
              </span>
              {movie.runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.release_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              {movie.original_language && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {movie.original_language.toUpperCase()}
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base max-w-2xl">
              {movie.overview}
            </p>

            {/* Director */}
            {director && (
              <p className="text-sm text-muted-foreground mb-6">
                <span className="text-foreground font-medium">Director: </span>
                {director.name}
              </p>
            )}

            {/* Budget / Revenue */}
            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="flex flex-wrap gap-6 mb-6 text-sm">
                {movie.budget > 0 && (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-0.5">Budget</span>
                    <span className="font-semibold text-foreground">{formatCurrency(movie.budget)}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-0.5">Revenue</span>
                    <span className="font-semibold text-foreground">{formatCurrency(movie.revenue)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  id="trailer"
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-red-700 text-white rounded-full px-6 gap-2 shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Trailer
                  </Button>
                </a>
              )}
              <Button
                onClick={() => movie && toggleFavorite(movie)}
                variant="outline"
                size="lg"
                className={cn(
                  'rounded-full px-6 gap-2 transition-all hover:scale-105 active:scale-95',
                  fav && 'border-primary/50 bg-primary/10 text-primary'
                )}
              >
                <Heart className={cn('w-4 h-4', fav && 'fill-primary')} />
                {fav ? 'Saved' : 'Add to Favorites'}
              </Button>
              {movie.homepage && (
                <a href={movie.homepage} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="lg" className="rounded-full px-6 gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Cast Section */}
        {topCast.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {topCast.map((person) => (
                <div key={person.id} className="shrink-0 w-24 sm:w-28 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-muted border border-border mb-2">
                    {person.profile_path ? (
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=1f1f1f&color=fff&size=96`; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl font-bold">
                        {person.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-tight">{person.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Trailer embed */}
        {trailer && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Trailer</h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border max-w-4xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                title={trailer.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.section>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {similarMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="w-full h-[50vh] sm:h-[60vh]" />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="-mt-48 flex flex-col lg:flex-row gap-8 lg:gap-12">
          <Skeleton className="w-44 sm:w-56 lg:w-72 aspect-[2/3] rounded-2xl mx-auto lg:mx-0" />
          <div className="flex-1 pt-4 lg:pt-32 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded mt-4" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 w-36 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
