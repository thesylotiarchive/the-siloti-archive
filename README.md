# The Sylheti Archive

The Sylheti Archive is a digital repository and research platform designed to preserve and explore the rich cultural, historical, and linguistic heritage of the Sylheti language and people. The application features a secure public archive for manuscripts, documents, folk music, audio recordings, field documentations, and traditional literature.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [Next.js 15](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (translucent panels, custom blur properties, and fluid responsive designs)
* **Database & ORM**: [PostgreSQL (Neon)](https://neon.tech/) & [Prisma Client](https://www.prisma.io/)
* **Caching**: [Upstash Redis](https://upstash.com/) (resilient REST connection API)
* **Email Service**: [Nodemailer](https://nodemailer.com/) (Gmail integration)
* **Uploads**: [UploadThing](https://uploadthing.com/) for media file hosting

---

## ⚡ Resilient Caching Architecture

We have integrated an Upstash Redis caching layer to offload heavy aggregation and database query operations (like recursive folder counting and content renders).

* **Zero-Risk Postgres Fallback**: All cache requests are wrapped in robust, silent try-catch blocks. If your Upstash free tier command limits are exceeded (`500,000 requests/month`) or Redis goes offline, the system will **automatically route queries back to PostgreSQL via Prisma directly** without throwing errors or causing downtime.
* **Timing & Origin Logs**: Every server data fetch prints console telemetry showing the precise timing and data source (e.g. `[CACHE HIT] Source: Upstash Redis` or `[CACHE MISS] Source: PostgreSQL Database`), showing before and after fetch timestamps so you can trace optimization gains.
* **Automatic Cache Invalidation**: The admin endpoints automatically trigger key deletions (`invalidateCache` or `invalidatePattern` for patterns like `blogs:list:*` and `collections:parent:*`) on create, edit, delete, and publish events to guarantee real-time data consistency.

---

## 📂 Key Directory Structure

```
├── prisma/                    # Prisma Database Schema and Seed Scripts
├── public/                    # Static Assets (Logos, Icons, Local Files)
├── src/
│   ├── app/                   # Next.js App Router Pages and API Handlers
│   │   ├── (admin)/           # Admin Console and Editors Dashboard
│   │   ├── (collection)/      # Archive Search, Collection Detail, and Media Views
│   │   ├── (home1 - home5)/   # Alternative Home landing pages
│   │   ├── (pdf-viewer)/      # Standalone PDF manuscript reader
│   │   ├── (public)/          # Public static sections (About, Donate, Contact, Blogs)
│   │   └── api/               # API Routes (divided into public/ and admin/)
│   ├── components/            # Reusable UI Components
│   │   ├── public/            # Shared Public components (Cards, Navbars, Renderers)
│   │   └── ui/                # Base design primitives (Radix, Dialogs, etc.)
│   └── lib/                   # Core helpers, Prisma & Redis connections, and Caching Core
```

---

## 🗺️ Application Paths (A to Z)

### Main Public Routes
* **`/`** — Main Landing Page (renders the premium `home2` layout theme).
* **`/about`** — **About Org**: Detailed information about the organization, mission, team statistics, and history.
* **`/blogs`** — **Blogs**: The index page listing all published articles and news.
* **`/blogs/[slug]`** — **Blog Post** *(Dynamic)*: Full-page view of a single blog article.
* **`/collection`** — **Archive / Collections**: The main browse hub of all root categories/folders in the archive.
* **`/collection/[id]`** — **Collection Folder** *(Dynamic)*: Category subfolders and media items inside folder `id`.
* **`/contact`** — **Contact Us**: Address details, inquiry forms, and contact points.
* **`/donate`** — **Donate**: Domestic bank transfer details, UPI QR codes, and PayPal checkout portal.
* **`/home1` - `/home5`** — Alternative landing themes.
* **`/login`** — **Sign In**: User account login page.
* **`/media/[id]`** — **Media Details** *(Dynamic)*: Premium view page for individual items (audio playback, video stream, image preview, or PDF frames).
* **`/pdf-viewer`** — **PDF Reader**: Standalone fullscreen viewer page for digital manuscripts.
* **`/people`** — **People / Team**: Gallery list of the archive team and contributors.
* **`/people/[id]`** — **Profile** *(Dynamic)*: Individual curator profile and submissions.
* **`/reports`** — **Reports & Publications**: Downloads and downloads of field documentations and publications.
* **`/search`** — **Search Archive**: Unified search containing live queries, filters, categories, and tags.
* **`/signup`** — **Create Account**: Contributor account registration page.
* **`/submit`** — **Submit Item**: Media upload and submission form for user contributions.
* **`/what-we-do`** — **What We Do**: Details of core linguistic, research, and documentation initiatives.

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Environment Setup
Create a `.env` file in the root directory and configure the following variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Authentication
JWT_SECRET="your_long_jwt_secret"

# UploadThing CDN Token
UPLOADTHING_TOKEN="your_uploadthing_token"

# Public URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Gmail SMTP Service (Nodemailer)
GMAIL_USER="your_email@gmail.com"
GMAIL_PASS="your_app_password"
ADMIN_EMAILS="email1@gmail.com,email2@gmail.com"

# PayPal client ID
ACHIVE_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://your-db-name.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄️ Database Management

### Start Prisma Studio
To visually inspect and manage your tables, run:
```bash
npx prisma studio
```
Navigate to [http://localhost:5555](http://localhost:5555) to view and edit database entries.

### Database Migrations
If you modify `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name <migration_name>
```

### Seed Database
To populate the database with seed pages or categories:
```bash
npx prisma db seed
```
