# Feedants

A production-grade MERN application for **Feedants** — the developer network for technical writers, creators, and engineering builders. Built from the Stitch UI templates and the "Kinetic Indigo Precision" design system, on a React + Vite + Tailwind + Redux Toolkit frontend and a Node + Express + MongoDB + JWT backend.

```
feedants-app/
├── frontend/   React 18 + Vite + Tailwind CSS + Redux Toolkit (RTK Query)
└── backend/    Node.js + Express + MongoDB (Mongoose) + JWT
```

## Quick start

You need Node.js 18+. MongoDB is optional — see [Mock-data mode](#mock-data-mode-no-mongodb-required) below.

### 1. Backend

```bash
cd backend
cp .env.example .env      # edit JWT_SECRET and MONGO_URI if you have one
npm install
npm run dev                # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` requests to `http://localhost:5000`.

### 3. (Optional) Seed a real MongoDB database

If you set a real `MONGO_URI` in `backend/.env`, populate it with the same demo dataset used by mock mode:

```bash
cd backend
npm run seed
```

## Demo login

Every seeded account (mock mode or after `npm run seed`) shares one demo password:

| Email | Password |
| --- | --- |
| `sarah@feedants.dev` | `Feedants@123` |
| `alex@feedants.dev` | `Feedants@123` |
| `elena@feedants.dev` | `Feedants@123` |
| `marcus@feedants.dev` | `Feedants@123` |

Or register a brand-new account from the app — that works in both modes too.

## Mock-data mode (no MongoDB required)

The backend tries to connect to `MONGO_URI` on startup. **If MongoDB is unreachable, the API automatically and transparently falls back to an in-memory mock data store** (`backend/utils/mockData.js` + `backend/utils/dataStore.js`) pre-seeded with 4 users, 4 posts, and 5 tech circles. Every endpoint — auth, posts, likes, comments, follows, circles — keeps working exactly the same way; only the storage layer changes. Check which mode you're in:

```bash
curl http://localhost:5000/api/v1/health
# { "dataSource": "mongodb" | "in-memory-mock", ... }
```

This means you can clone the repo and run the full app immediately with zero external services, then point `MONGO_URI` at a real database whenever you're ready — no code changes required.

> Note: mock mode stores data in the Node process's memory, so it resets whenever the server restarts.

## Backend architecture

```
backend/
├── config/db.js              Mongo connection + live/mock state flag
├── controllers/               Route handlers (auth, posts, users, circles)
├── middlewares/                JWT guard, Zod validation, async wrapper, error handler
├── models/                     Mongoose schemas: User, Post, Comment, Circle
├── routes/                     Express routers per resource
├── utils/
│   ├── dataStore.js            Data-access layer — Mongo or mock, transparently
│   ├── mockData.js             In-memory seed dataset
│   ├── seed.js                 `npm run seed` script for a real database
│   ├── ApiError.js             Typed HTTP error class
│   └── generateToken.js        JWT sign/verify helpers
├── validators/                 Zod request schemas
└── server.js                   Express app entry point
```

### API endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | — | Create an account |
| POST | `/api/v1/auth/login` | — | Sign in |
| GET | `/api/v1/auth/me` | ✅ | Current user |
| POST | `/api/v1/auth/logout` | ✅ | Sign out |
| GET | `/api/v1/posts` | optional | Paginated feed (`tag`, `circle`, `author`, `search`, `page`, `limit`) |
| POST | `/api/v1/posts` | ✅ | Create a post |
| GET | `/api/v1/posts/:id` | optional | Single post |
| PATCH | `/api/v1/posts/:id` | ✅ (owner) | Edit a post |
| DELETE | `/api/v1/posts/:id` | ✅ (owner) | Delete a post |
| POST | `/api/v1/posts/:id/like` | ✅ | Toggle like |
| POST | `/api/v1/posts/:id/bookmark` | ✅ | Toggle bookmark |
| GET | `/api/v1/posts/:id/comments` | — | List comments |
| POST | `/api/v1/posts/:id/comments` | ✅ | Add a comment |
| GET | `/api/v1/posts/trending/tags` | — | Trending tags |
| GET | `/api/v1/users/:username` | optional | Public profile + posts + stats |
| PATCH | `/api/v1/users/me` | ✅ | Update own profile |
| POST | `/api/v1/users/:id/follow` | ✅ | Toggle follow |
| GET | `/api/v1/users/search?q=` | — | Search users |
| GET | `/api/v1/users/creators` | — | Curated creators |
| GET | `/api/v1/circles` | — | List circles (`?category=`) |
| POST | `/api/v1/circles` | ✅ | Create a circle |
| GET | `/api/v1/circles/:idOrSlug` | — | Circle detail |
| POST | `/api/v1/circles/:id/join` | ✅ | Toggle membership |
| GET | `/api/v1/health` | — | Health check + active data source |

## Frontend architecture

```
frontend/src/
├── components/
│   ├── ui/            Button, Badge, Card, Avatar, Modal, Input, CodeBlock, Spinner
│   ├── common/         Header, Footer, Sidebar, LayoutWrapper, ProtectedRoute
│   ├── feed/            PostComposer, PostCard, CodeSnippetBlock, EngagementActions, CommentThread
│   ├── explore/         TechRadarGrid, CircleCard, CreatorCard
│   ├── profile/         ProfileHeader, StatsStrip, TechStackBadges
│   └── auth/            AuthModal, LoginForm, RegisterForm
├── hooks/               useAuth, useDebounce, useCopyClipboard, useTheme
├── pages/                HomePage, ExplorePage, ProfilePage, AuthPage, SettingsPage, BookmarksPage, NotFoundPage
├── services/             axiosInstance.js — JWT injection + 401 auto-logout interceptors
├── store/
│   ├── store.js
│   ├── slices/           authSlice (persisted session), uiSlice (modals/tabs/filters)
│   └── api/               RTK Query slices: apiSlice, authApi, postsApi, usersApi, circlesApi
└── utils/                 formatters, validation, constants, cn (class merge)
```

Key implementation notes:

- **JWT injection & auto-logout**: `services/axiosInstance.js` attaches `Authorization: Bearer <token>` to every request and clears credentials on any `401` response.
- **Optimistic updates**: liking a post, bookmarking a post, following a user, and joining a circle all update the RTK Query cache immediately and roll back automatically if the server request fails (see `onQueryStarted` in the relevant API slice).
- **Design tokens**: `tailwind.config.js` encodes the full Kinetic Indigo Precision palette, type scale, spacing, radius, and shadow tokens extracted from the Stitch design system.

## Environment variables

**backend/.env**

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `CLIENT_URL` | Frontend origin for CORS |
| `MONGO_URI` | MongoDB connection string (omit or leave unreachable to use mock mode) |
| `JWT_SECRET` | Secret used to sign JWTs — change this before deploying |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `RATE_LIMIT_MAX` | Max requests per window per IP |

**frontend/.env**

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL the frontend calls (default `http://localhost:5000/api/v1`) |

## Production build

```bash
cd frontend && npm run build   # outputs frontend/dist
cd backend && npm start        # NODE_ENV=production node server.js
```

Serve `frontend/dist` from any static host (Vercel, Netlify, Nginx, or Express's `express.static`) and point `VITE_API_BASE_URL` at your deployed backend.
