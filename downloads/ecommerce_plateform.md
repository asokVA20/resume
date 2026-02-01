# Technical Document — E-Commerce Dropshipping Platform

**Purpose:** Project overview, technology stack, architecture, and demonstrated skills for candidate evaluation.

---

## 1. Project Overview

A **full-stack e-commerce dropshipping platform** built with Next.js, featuring AI-powered search, conversational commerce, Stripe payments, returns management, shipping provider integration, and supplier/dropshipping APIs. The application is production-ready with Docker containerization, multi-service orchestration, health checks, and optional monitoring (Prometheus/Grafana).

**Scope:** Customer storefront, admin dashboard, REST API, PWA support, analytics, and deployment automation.

**Development Phases (as implemented):**
- **Phase 1:** Foundation — DB schema, auth, admin, product CRUD
- **Phase 2:** Core e-commerce — Cart, checkout, Stripe, orders, account
- **Phase 3:** AI & personalization — Semantic search (OpenAI), recommendations, chatbot, behavior tracking
- **Phase 4:** Advanced — PWA, returns/refunds, shipping providers (e.g. USPS), dropshipping supplier integration (e.g. AliExpress)
- **Phase 5:** Testing & launch — Unit (Jest), E2E (Playwright), Docker, deploy scripts, monitoring

---

## 2. Technology Stack

### 2.1 Runtime & Language
| Tool | Version / Role |
|------|----------------|
| **Node.js** | 20+ (Alpine in Docker) |
| **TypeScript** | ^5 |
| **npm** | Package manager |

### 2.2 Framework & Meta-Framework
| Tool | Version / Role |
|------|----------------|
| **Next.js** | 16.1.1 — App Router, API Routes, Turbopack, standalone output |
| **React** | 19.2.3 |
| **React DOM** | 19.2.3 |

### 2.3 Styling & UI
| Tool | Version / Role |
|------|----------------|
| **Tailwind CSS** | ^4 |
| **@tailwindcss/postcss** | ^4 — PostCSS integration |
| **PostCSS** | postcss.config.mjs |
| **class-variance-authority (cva)** | ^0.7.1 — Component variants |
| **clsx** | ^2.1.1 — Conditional class names |
| **tailwind-merge** | ^3.4.0 — Merge Tailwind classes |
| **Framer Motion** | ^12.25.0 — Animations |
| **Lucide React** | ^0.562.0 — Icons |
| **@radix-ui/react-checkbox** | ^1.3.3 |
| **@radix-ui/react-icons** | ^1.3.2 |
| **@radix-ui/react-label** | ^2.1.8 |
| **@radix-ui/react-radio-group** | ^1.3.8 |
| **@radix-ui/react-select** | ^2.2.6 |
| **@headlessui/react** | ^2.2.9 — Accessible headless components |
| **@heroicons/react** | ^2.2.0 — Icons |

### 2.4 State & Data Fetching
| Tool | Version / Role |
|------|----------------|
| **Zustand** | ^5.0.9 — Client state (auth, cart, products) |
| **TanStack React Query** | ^5.90.16 — Server state, caching |
| **@tanstack/react-query-devtools** | ^5.91.2 — DevTools |

### 2.5 Backend & Data
| Tool | Version / Role |
|------|----------------|
| **PostgreSQL** | 16 (pg driver ^8.16.3) — Primary database |
| **pg** | ^8.16.3 — Node PostgreSQL client |
| **bcryptjs** | ^3.0.3 — Password hashing |
| **jsonwebtoken** | ^9.0.3 — JWT auth |

### 2.6 Payments & External APIs
| Tool | Version / Role |
|------|----------------|
| **Stripe** | ^20.1.2 — Server-side payments |
| **@stripe/react-stripe-js** | ^5.4.1 — Stripe Elements (client) |
| **@stripe/stripe-js** | ^8.6.1 — Stripe.js loader |
| **OpenAI** | ^6.16.0 — Search intent, recommendations, chatbot |

### 2.7 Utilities & Helpers
| Tool | Version / Role |
|------|----------------|
| **date-fns** | ^4.1.0 — Date formatting |

### 2.8 Development & Quality
| Tool | Version / Role |
|------|----------------|
| **ESLint** | ^9 |
| **eslint-config-next** | 16.1.1 (core-web-vitals, typescript) |
| **Jest** | ^30.2.0 — Unit/integration tests |
| **jest-environment-jsdom** | ^30.2.0 |
| **next/jest** | Next.js Jest preset |
| **@testing-library/jest-dom** | ^6.9.1 |
| **@testing-library/react** | ^16.3.1 |
| **@testing-library/user-event** | ^14.6.1 |
| **Playwright** | @playwright/test ^1.57.0 — E2E (Chromium, Firefox, WebKit, Mobile) |
| **TypeScript** | ^5 — Strict mode, path aliases (@/*) |

### 2.9 DevOps & Infrastructure
| Tool | Role |
|------|------|
| **Docker** | Multi-stage Dockerfile (deps → builder → runner) |
| **Docker Compose** | app, db (PostgreSQL 16), redis (Redis 7), nginx, prometheus, grafana |
| **Node 20 Alpine** | Base image; non-root user; healthcheck via `/api/health` |
| **PostgreSQL** | postgres:16-alpine — Primary DB, init script from schema.sql |
| **Redis** | redis:7-alpine — Caching/sessions (referenced in env) |
| **Nginx** | nginx:alpine — Reverse proxy (production profile) |
| **Prometheus** | prom/prometheus — Metrics (monitoring profile) |
| **Grafana** | grafana/grafana — Dashboards (monitoring profile) |
| **Bash** | deploy.sh — Deploy, backup, rollback, health |
| **PowerShell** | populate-database-simple.ps1 — DB seeding (Windows) |

### 2.10 Build & Tooling
| Tool | Role |
|------|------|
| **Next.js** | output: 'standalone', Turbopack, image optimization (WebP/AVIF), security headers, webpack splitChunks |
| **autoprefixer** | ^10.4.20 — CSS (via Tailwind) |

### 2.11 Type Definitions (Dev)
| Tool | Version |
|-----|---------|
| @types/bcryptjs | ^2.4.6 |
| @types/jsonwebtoken | ^9.0.10 |
| @types/jest | ^30.0.0 |
| @types/node | ^20 |
| @types/pg | ^8.11.14 |
| @types/react | ^19 |
| @types/react-dom | ^19 |

---

## 3. Key Features & Achievements

- **Product catalog:** Full CRUD, categories, variants, images, featured products, search API with pagination.
- **AI-powered search:** Semantic search via OpenAI (intent + entities + filters); fallback to text search if API unavailable.
- **Personalized recommendations:** API and UI for product recommendations (AI/behavior-driven).
- **Conversational chatbot:** OpenAI-based chatbot component and provider for storefront support.
- **Shopping cart:** Persistent cart API (get, add, update, remove items) and cart UI (dropdown, summary, items).
- **Checkout:** Multi-step checkout (shipping, payment, order review), Stripe Payment Intents, success page.
- **Payments:** Stripe integration (create-intent API, webhook for events), PCI-aware handling.
- **Orders:** Order lifecycle, shipping label/tracking APIs, dropship API for supplier fulfillment.
- **Returns & refunds:** Returns API (create, list, get by ID), return request flow and return-details UI.
- **Shipping:** Pluggable shipping (base provider, manager, USPS provider), rate and admin provider APIs.
- **Dropshipping / suppliers:** Supplier manager, base supplier, AliExpress-like supplier implementation; admin supplier CRUD and sync API.
- **Auth:** JWT-based login/register/me APIs; role-based access (customer, admin).
- **Admin dashboard:** Layout, sidebar, header; admin pages for products, shipping providers, suppliers.
- **Analytics:** Events API and client-side analytics hook for behavior tracking.
- **PWA:** manifest.json, service worker (sw.js) for caching static/dynamic and API patterns; PWA provider component.
- **Performance:** Lazy image component, Next.js image optimization, security and cache headers, bundle splitting.
- **Health:** `/api/health` for DB connectivity and monitoring.
- **Rate limiting:** In-memory rate limiter utility (production path for Redis).
- **Testing:** Jest for unit/component tests (e.g. button, format, validation); Playwright E2E for homepage, products, cart-checkout.
- **Deployment:** Docker Compose multi-service setup; deploy script (prereqs, backup, deploy, rollback, health).

---

## 4. Technical Skills Demonstrated

- **Full-stack:** Next.js App Router, API Routes, server and client components, server-side DB access.
- **TypeScript:** Strict mode, shared types, path aliases, typed API responses and DB layer.
- **Database:** PostgreSQL schema design (users, products, categories, orders, cart, returns, analytics, etc.), connection pooling, migrations via schema.sql.
- **API design:** RESTful routes, consistent success/error response helpers, pagination, validation.
- **Auth & security:** JWT, bcrypt, role-based access, security headers (X-Frame-Options, CSP-relevant, etc.), rate limiting.
- **Payments:** Stripe Payment Intents, webhooks, client-side Elements integration.
- **AI/ML integration:** OpenAI for search intent, recommendations, and chatbot; graceful fallback when keys missing.
- **State management:** Zustand for global client state; TanStack Query for server state and caching.
- **UI/UX:** Responsive layout, Radix/Headless UI accessibility, Tailwind, Framer Motion, PWA and offline-oriented service worker.
- **DevOps:** Docker multi-stage build, Compose orchestration, health checks, optional Prometheus/Grafana, deploy and rollback scripting.
- **Testing:** Unit tests (Jest, Testing Library), E2E (Playwright, multi-browser and mobile).
- **Code quality:** ESLint (Next.js config), structured project layout and separation of concerns.

---

## 5. Project Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client (Browser / PWA)                         │
│  React 19 · Next.js App Router · Zustand · TanStack Query · Stripe.js   │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Next.js Server (Node 20)                             │
│  API Routes · Server Components · Middleware · Standalone Output        │
└─────────────────────────────────────────────────────────────────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐
│   PostgreSQL     │  │      Redis        │  │  External Services        │
│   (primary DB)   │  │  (cache/session)  │  │  Stripe · OpenAI · USPS    │
└──────────────────┘  └──────────────────┘  └──────────────────────────┘
```

### 5.2 Directory Structure (Summary)

```
ecommerce/
├── src/
│   ├── app/
│   │   ├── (store)/              # Storefront routes (about, cart, checkout, products, account, returns, …)
│   │   ├── admin/                # Admin layout & pages (dashboard, products, shipping, suppliers)
│   │   ├── api/                  # API routes (auth, cart, orders, products, search, payments, webhooks, …)
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   └── icon.tsx, apple-icon.tsx
│   ├── components/               # UI, cart, checkout, chat, admin, layout, performance, PWA, returns
│   ├── hooks/                    # use-analytics, use-mobile
│   ├── lib/                      # database, openai, analytics, api-response, rate-limit, validation, schema.sql
│   │   ├── shipping/             # base-shipping, shipping-manager, usps-provider
│   │   └── suppliers/            # base-supplier, supplier-manager, aliexpress-supplier
│   ├── store/                    # Zustand: auth, cart, products, index
│   ├── types/                    # Shared TypeScript types
│   └── utils/                    # cn, format, validation + __tests__
├── e2e/                          # Playwright specs (homepage, products, cart-checkout)
├── public/                       # manifest.json, sw.js, static assets
├── config/                       # production.env.example
├── scripts/                      # deploy.sh, populate-database-simple.ps1, test-data.sql
├── next.config.ts, tsconfig.json, eslint.config.mjs
├── jest.config.js, jest.setup.js, playwright.config.ts, postcss.config.mjs
├── Dockerfile, docker-compose.yml
├── env.example
└── package.json
```

### 5.3 API Surface (Grouped)

- **Auth:** `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- **Products:** `GET/POST /api/products`, `GET/PATCH/DELETE /api/products/[id]`, `GET /api/products/featured`, `GET /api/products/search`
- **Categories:** `GET /api/categories`
- **Cart:** `GET/POST /api/cart`, `PATCH/DELETE /api/cart/items/[itemId]`
- **Checkout / Payments:** `POST /api/payments/create-intent`, `POST /api/webhooks/stripe`
- **Orders:** `GET /api/orders/[orderId]/shipping/label`, `.../tracking`, `.../dropship`
- **Shipping:** `GET /api/shipping/rates`
- **Returns:** `GET/POST /api/returns`, `GET /api/returns/[returnId]`
- **Recommendations:** `GET /api/recommendations`
- **Analytics:** `POST /api/analytics/events`
- **Health:** `GET /api/health`
- **Admin:** `/api/admin/shipping/providers`, `/api/admin/suppliers`, `/api/admin/suppliers/[id]`, `/api/admin/suppliers/sync`

### 5.4 Data Flow (Examples)

- **Search:** Client → `GET /api/products/search?query=...` → OpenAI `analyzeSearchIntent()` → PostgreSQL with filters → paginated JSON.
- **Checkout:** Cart (Zustand) → shipping form → `POST /api/payments/create-intent` → Stripe Elements → confirmation → Stripe webhook updates order state.
- **Auth:** Login form → `POST /api/auth/login` → bcrypt compare + JWT sign → token stored client-side; `GET /api/auth/me` for session.

---

## 6. Complete Tools Inventory (Every Tool Used)

Consolidated list of every tool, library, and service referenced or used in the project.

### Runtime & Core
- Node.js 20
- npm
- TypeScript 5

### Framework & UI
- Next.js 16.1.1
- React 19.2.3
- React DOM 19.2.3
- Tailwind CSS 4
- @tailwindcss/postcss 4
- PostCSS (config: postcss.config.mjs)
- class-variance-authority 0.7.1
- clsx 2.1.1
- tailwind-merge 3.4.0
- Framer Motion 12.25.0
- Lucide React 0.562.0
- @radix-ui/react-checkbox 1.3.3
- @radix-ui/react-icons 1.3.2
- @radix-ui/react-label 2.1.8
- @radix-ui/react-radio-group 1.3.8
- @radix-ui/react-select 2.2.6
- @headlessui/react 2.2.9
- @heroicons/react 2.2.0

### State & Data
- Zustand 5.0.9
- TanStack React Query 5.90.16
- @tanstack/react-query-devtools 5.91.2

### Backend & Data
- pg 8.16.3
- PostgreSQL 16 (server)
- bcryptjs 3.0.3
- jsonwebtoken 9.0.3

### Payments & External APIs
- stripe 20.1.2
- @stripe/react-stripe-js 5.4.1
- @stripe/stripe-js 8.6.1
- openai 6.16.0

### Utilities
- date-fns 4.1.0

### Linting & Formatting
- ESLint 9
- eslint-config-next 16.1.1 (core-web-vitals, typescript)

### Testing
- Jest 30.2.0
- jest-environment-jsdom 30.2.0
- next/jest (preset)
- @testing-library/jest-dom 6.9.1
- @testing-library/react 16.3.1
- @testing-library/user-event 14.6.1
- @playwright/test 1.57.0

### Type Definitions
- @types/bcryptjs 2.4.6
- @types/jsonwebtoken 9.0.10
- @types/jest 30.0.0
- @types/node 20
- @types/pg 8.11.14
- @types/react 19
- @types/react-dom 19

### Build & CSS
- autoprefixer 10.4.20

### DevOps & Infrastructure
- Docker (multi-stage Dockerfile)
- Docker Compose
- Node 20 Alpine (base image)
- postgres:16-alpine
- redis:7-alpine
- nginx:alpine
- prom/prometheus (optional profile)
- grafana/grafana (optional profile)
- Bash (deploy.sh)
- PowerShell (populate-database-simple.ps1)
- curl (healthcheck in Dockerfile and deploy script)

### Config & Project Files
- next.config.ts (Next.js)
- tsconfig.json (TypeScript)
- eslint.config.mjs (ESLint)
- jest.config.js (Jest)
- jest.setup.js (Jest mocks)
- playwright.config.ts (Playwright)
- postcss.config.mjs (PostCSS)
- env.example / config/production.env.example (environment templates)

### External Services (Configurable via Env)
- Stripe (payments)
- OpenAI (search, recommendations, chatbot)
- PostgreSQL (database)
- Redis (caching/sessions)
- SMTP (email — optional)
- SendGrid (optional, in env.example)
- Cloudinary (optional, in env.example)
- Google Analytics (optional)
- Sentry (optional, in production.env.example)
- Datadog (optional, in production.env.example)

---

## 7. Optional Additions for Recruiters

- **Repo:** Link to repository or demo if available.
- **Live demo:** URL to deployed app (e.g. Vercel/Railway) if shared.
- **Role:** Clarify whether the candidate was sole developer or part of a team and their main areas (e.g. API, frontend, DevOps).
- **Timeline:** Approximate duration of the project or phases.

---

*Document generated from the current codebase. Last updated: February 2025.*
