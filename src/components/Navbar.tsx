// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Film, X, Menu } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMovieStore } from '@/store/useMovieStore';
import { cn } from '@/lib/utils';

const searchSchema = z.object({
  query: z.string().min(1, 'Please enter a search term'),
});
type SearchForm = z.infer<typeof searchSchema>;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const favorites = useMovieStore((s) => s.favorites);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const onSearch = (data: SearchForm) => {
    navigate(`/search?q=${encodeURIComponent(data.query)}`);
    setSearchOpen(false);
    reset();
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl text-white tracking-wide">Movie</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" label="Home" active={location.pathname === '/'} />
            <NavLink to="/favorites" label="Favorites" active={location.pathname === '/favorites'} />
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit(onSearch)}
                  className="flex items-center"
                >
                  <div className="flex items-center gap-1 bg-input border border-border rounded-full px-3 py-1.5 w-56 sm:w-72">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      {...register('query')}
                      autoFocus
                      placeholder="Search movies..."
                      className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); reset(); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.query && (
                    <span className="text-xs text-red-400 ml-2">{errors.query.message}</span>
                  )}
                </motion.form>
              ) : (
                <motion.button
                  key="search-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 bg-input border border-border rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors w-40 hidden sm:flex"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  Search Movie
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
            >
              <Heart className={cn('w-5 h-5', favorites.length > 0 && 'fill-primary text-primary')} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <nav className="flex flex-col py-4 gap-1">
                <MobileNavLink to="/" label="Home" />
                <MobileNavLink to="/favorites" label={`Favorites ${favorites.length > 0 ? `(${favorites.length})` : ''}`} />
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        'text-sm font-medium transition-colors relative pb-0.5',
        active ? 'text-white' : 'text-muted-foreground hover:text-white'
      )}
    >
      {label}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      )}
    </Link>
  );
}

function MobileNavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-muted transition-colors rounded-md">
      {label}
    </Link>
  );
}
