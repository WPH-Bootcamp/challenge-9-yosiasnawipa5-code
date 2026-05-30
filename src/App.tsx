// src/App.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <MovieDetailPage />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/search"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <SearchPage />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/favorites"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <FavoritesPage />
              </Suspense>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground font-sans">
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
