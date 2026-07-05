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
* **Alerts & Dialogs**: [SweetAlert2](https://sweetalert2.github.io/) for smooth contributor confirmations

---

## 📂 Key Directory Structure

```
├── prisma/                    # Prisma Database Schema and Seed Scripts
├── public/                    # Static Assets (Logos, Icons, SVG presets)
├── src/
│   ├── app/                   # Next.js App Router Pages and API Handlers
│   │   ├── (admin)/           # Admin Console and Editors Dashboard
│   │   ├── (collection)/      # Archive Search, Collection Detail, and Media Views
│   │   ├── (home1 - home5)/   # Alternative Home landing pages
│   │   ├── (pdf-viewer)/      # Standalone PDF manuscript reader
│   │   ├── (public)/          # Public sections (About, Donate, Contact, Blogs, Profile)
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
* **`/login`** — **Sign In**: User account login page (supports Email or Username login).
* **`/media/[id]`** — **Media Details** *(Dynamic)*: Premium view page for individual items (audio playback, video stream, image preview, or PDF frames).
* **`/pdf-viewer`** — **PDF Reader**: Standalone fullscreen viewer page for digital manuscripts.
* **`/people`** — **People / Team**: Gallery list of the archive team and contributors.
* **`/people/[id]`** — **Profile** *(Dynamic)*: Individual curator profile and submissions.
* **`/profile`** — **My Profile**: Secure dashboard to update name, email, password, and custom avatars.
* **`/reports`** — **Reports & Publications**: Downloads of field documentations and publications.
* **`/search`** — **Search Archive**: Unified search containing live queries, filters, categories, and tags.
* **`/signup`** — **Create Account**: Contributor account registration page with custom preset avatar picker.
* **`/submit`** — **Submit Item**: Unified contribution hub for contributors to upload folders, blogs, or media files and track review states.
* **`/what-we-do`** — **What We Do**: Details of core linguistic, research, and documentation initiatives.

---

## 🌟 Platform Feature Breakdown

### 🏛️ Original Core Features
1. **Static Content Pages**: Public informational routes including About Us, What We Do, Reports, Contact, and Donate.
2. **Generic Database Models**: Base schema configuration for Users, Roles, Blogs, Folders, and Media Items.
3. **Public Collection Browsing**: Nested collection folder tree navigation and search capabilities.
4. **Basic Authentication**: Standard Sign-in/Sign-up session flows.

---

### 🚀 New Features Added by Basir (`Engineer-BK`)

Basir has upgraded the archive into a premium, performance-optimized curation platform with the following major implementations:

#### 1. Resilient Caching Architecture (Upstash Redis & PostgreSQL Fallback)
* **Why Caching was Implemented**: To ensure sub-second response times for read-heavy operations. Fetching deep nested collection trees, page content blocks, and statistics counts was previously hammering the database, slowing down page loads. Memory-caching these responses drastically reduces database overhead.
* **Core Caching Utility (`cache.js`)**: Encapsulates data fetching through `getCachedData(key, fetchFn, ttl)`. It first polls Upstash Redis.
* **Seamless PostgreSQL Fallback**: If Upstash hits command quotas, experiences connection issues, or goes offline, the utility **silently catches the error** and routes query execution directly back to PostgreSQL via Prisma.
* **Console Telemetry Logs**: Prints precise logging in the console showing execution durations and data origin. Example output:
  ```
  [CACHE HIT] Source: Upstash Redis
    Key:         "collections:parent:root"
    Before Time: 23:03:06.950
    After Time:  23:03:07.395
    Duration:    444.16ms (PostgreSQL query avoided)
  ```
* **Cache Invalidation**: Triggers key deletions (`invalidateCache` / `invalidatePattern`) automatically on admin actions (creating, updating, deleting, or publishing folder/media/blog records) to guarantee real-time data sync.

#### 2. Unified Public Submissions Dashboard (`/submit`)
* **Multi-type Form Switcher**: A segmented control allowing contributors to submit **[ Media Items | Folders | Blog Articles ]**.
* **Automated File Parsing**: Uploading files (PDF, Audio, Images) automatically parses filenames to set the title input, strips file extensions, and auto-detects and checks matching Media Types (e.g. `.mp3` ➔ `AUDIO`).
* **YouTube and URL Metadata Scraper Proxy**:
  - Implemented `/api/public/metadata` proxy on URL field focus-out/blur.
  - Automatically scrapes the webpage's meta headers to pre-fill Title, Description, and extracts high-resolution YouTube thumbnails.
  - Displays a glassmorphic loading screen (*"Fetching details... please wait..."*) during scraper parsing.
* **Creator Attribute**: Pushed schema updates to Neon DB to support custom `author` fields on submissions.

#### 3. Curation Review Pipeline & Feedback System
* **Submission Curation List**: Contributors can view their aggregated submitted drafts and check their status (**Pending**, **Approved**, or **Rejected**) in real time.
* **Rejection Reason Comments**: Administrators can reject dynamic drafts from their inbox and input a rejection reason. The feedback is rendered dynamically to the contributor on their submissions dashboard.
* **Pending Deletion**: Contributors can safely delete their pending (`DRAFT`) or rejected contributions. SweetAlert2 confirmation dialogs prevent accidental deletion.

#### 4. Custom Profile Management (`/profile`)
* **Avatar Preset Picker**: Added 15 beautiful preset SVG icons (stored in `public/svg_profiles`) that users can select as their profile picture on signup or profile pages.
* **Device Image Uploads**: Supports uploading custom profile pictures from devices using UploadThing.
* **Signup Fallback**: Automatically assigns a random SVG preset avatar to the user's database record on registration if they do not choose one.
* **Dual Login Mode**: Users can log in using either their **Email** or **Username** seamlessly.
* **Profile Settings Editor**: A private portal to update Name, Email, Profile Picture, and change Passwords. Form inputs include interactive `Eye` and `EyeOff` toggles to display/hide password text.

#### 5. Premium Glassmorphic Light-Mode Admin UI/UX
* **Admin Dashboard Overhaul**: Transformed 12 dashboard paths into a premium light glassmorphic styling, incorporating translucent panels (`bg-white/70 backdrop-blur-md`), background glow spheres, and active navigation highlights.
* **Contrast Enhancements**: Updated all description lists, helper text, and subtitles from low-contrast styles (`text-slate-400`/`text-slate-500`) to highly visible **`text-slate-600`** to guarantee WCAG compliance and legibility.
* **Cancel button controls**: Injected **Cancel** buttons on blog creators, editors, and folder modals to allow easy navigation.

#### 6. Site-wide Notification & Contributor Request System
* **Contributor requests flow**: Automatically assigns `VIEWER` role on registration and locks down `/submit` page. Standard viewers can submit a request statement to gain contributor privileges.
* **Admin Requests Curation**: Admins can approve or decline requests directly at `/admin/dashboard/requests` with custom feedback comments.
* **Notification Bell**: Site-wide bell in the navbars displaying unread notification items, redirection links, and dynamic counts.
* **Role Enforcement**: Restricts access to admin routing (`/admin/*`) and endpoints (`/api/admin/*`) strictly to `ADMIN` and `SUPERADMIN` roles.

#### 7. Luxury Black & White Admin UI/UX & SweetAlert2 Overhaul
* **Monochrome luxury theme**: Replaced green gradients and glowing backdrops with a crisp print-inspired black-and-white theme. Renders off-white backgrounds, pure white cards with generous gaps, and active sidebar items in solid black capsules.
* **SweetAlert2 Curation**: Replaced all native browser alert, confirm, and prompt boxes across the drafts inbox and curation tables with SweetAlert2. Capture soft-deletion reasons and decline statements directly inside styled `Swal.fire` textareas.
* **File Upload button styling**: Re-styled `Choose File` upload buttons inside form grids to solid black to prevent them from blending into white backdrops.

#### 8. File Size Restrictions & Client Cache Logs
* **Targeted size boundaries**: Implemented limits in `uploadthing.config.js` restricting video uploads to `10MB` and audio, PDF, and image uploads to `5MB`. Updated all frontend helper texts.
* **Client-side Cache Telemetry**: Injected server cache performance logs into response headers (`x-cache-log`). Built a global interceptor in `layout.js` that intercepts headers and prints formatted Hit/Miss metrics and latencies directly in the browser console.

#### 9. Site-wide Light/Dark Theme System (Unified CSS Variables & Tailwind)
* **Objective**: To build a dynamic, theme-responsive interface across all public pathways, eliminating locked colors and ensuring perfect readability.
* **Theme Provider & Tailwind integration**: Configured a React provider that toggles `.dark` class names dynamically on the html root and syncs the preference with client-side localStorage. All main color scales in `globals.css` map to standard variables (`bg-background`, `text-foreground`, `border-border`, etc.).
* **Refactored Routes**: Converted **10 public routes** that were locked to dark/light-only modes (`/pdf-viewer`, `/about`, `/blogs`, `/contact`, `/donate`, `/people`, `/people/[id]`, `/profile`, `/reports`, `/what-we-do`). 
* **Details Adaptation**: Presets picker grids, upload panels, UPI QR Lightbox zoom dialogs, currency switches, copy buttons, skeleton loading cards, and bullet lists now render off-white/dark borders and fonts based on the selected theme.

---

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory and configure the variables:

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

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Database Controls
```bash
npx prisma studio       # Starts visual schema explorer on http://localhost:5555
npx prisma db seed      # Seed static system structures
```
