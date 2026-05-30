// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-lg text-white">Movie</span>
          </Link>
          <p className="text-xs text-muted-foreground text-center">
            Copyright ©{new Date().getFullYear()} Movie Explorer. Powered by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
