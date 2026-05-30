# 🎬 Movie Explorer

Aplikasi web untuk menjelajahi film menggunakan [TMDB API](https://www.themoviedb.org/), dibangun dengan React 19, TypeScript, dan Vite.

## Tech Stack

- **React 19** — UI Library
- **TypeScript** — Type Safety
- **Vite** — Build Tool
- **TanStack React Query** — Data Fetching & Caching
- **Zustand** — State Management (Favorites persisted to localStorage)
- **React Router v6** — Client-side Routing
- **Radix UI & shadcn/ui** — Accessible UI Components
- **Zod & React Hook Form** — Form Validation
- **Framer Motion** — Page transitions & animations
- **Tailwind CSS** — Styling

## Fitur

- 🏠 **Home Page** — Hero section, Trending Now (horizontal scroll + rank), New Release (grid + load more)
- 🎬 **Movie Detail** — Poster, backdrop, genres, cast, trailer embed, similar movies
- 🔍 **Search** — Real-time search with Zod validation, paginated results
- ❤️ **Favorites** — Add/remove favorites, persisted to localStorage via Zustand
- ✨ **Animations** — Page transitions, stagger reveals, hover effects, shimmer skeletons
- 📱 **Fully Responsive** — Mobile, tablet, desktop

## Setup

### 1. Clone & Install

```bash
git clone <repo>
cd movie-explorer
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

Dapatkan API key gratis di [TMDB Settings → API](https://www.themoviedb.org/settings/api).

### 3. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173)

### 4. Build Production

```bash
npm run build
npm run preview
```

## Struktur Project

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components (Button, Input, Badge, Skeleton)
│   ├── Navbar.tsx       # Sticky navbar with search, favorites badge, mobile menu
│   ├── HeroSection.tsx  # Featured movie hero with backdrop
│   ├── MovieCard.tsx    # Movie poster card with hover effects & favorite toggle
│   ├── TrendingRow.tsx  # Horizontal scroll row with rank badges
│   ├── MovieGrid.tsx    # Responsive grid with load more
│   ├── Footer.tsx
│   ├── ErrorMessage.tsx
│   └── PageTransition.tsx
├── pages/
│   ├── HomePage.tsx         # / route
│   ├── MovieDetailPage.tsx  # /movie/:id route
│   ├── SearchPage.tsx       # /search route
│   └── FavoritesPage.tsx    # /favorites route
├── hooks/
│   └── useMovies.ts     # All React Query hooks
├── services/
│   └── movieService.ts  # TMDB API functions
├── store/
│   └── useMovieStore.ts # Zustand store (favorites + search state)
├── types/
│   └── movie.ts         # TypeScript interfaces
├── lib/
│   ├── axios.ts         # Axios instance + image URL helpers
│   └── utils.ts         # cn(), formatRating(), formatRuntime(), etc.
└── main.tsx
```

## Deploy

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variable `VITE_TMDB_API_KEY` di Vercel dashboard.

### Netlify

```bash
npm run build
# Upload dist/ folder, atau connect GitHub repo
```

Set environment variable di Netlify dashboard.
