# Hopenix School — Production Vercel & SQL Deployment Guide

This guide details the step-by-step instructions for deploying the **Hopenix School System** with SQL persistence, Prisma ORM, and Vercel serverless API functions.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- A PostgreSQL database provider (e.g., [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres).
- Node.js (v18 or higher) installed locally for initial migration and seeding.

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Provision a PostgreSQL Database
1. Go to [Neon.tech](https://neon.tech) (recommended) or [Supabase](https://supabase.com).
2. Create a new project named `hopenix-school`.
3. Copy your PostgreSQL connection string (`DATABASE_URL`).
   - Format: `postgresql://user:password@ep-sample-123456.us-east-1.aws.neon.tech/hopenix_db?sslmode=require`

### Step 2: Configure Local Environment & Run Prisma Migrations
1. Clone the project and install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in the root directory:
   ```env
   DATABASE_URL="your-postgresql-connection-string-here"
   JWT_SECRET="your-secure-random-jwt-secret-key-here"
   ```
3. Generate Prisma client & push database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Seed the initial database with default Admin (`admin@hopenix.edu`), sample Teacher, Classes, Sections, Subjects, and Events:
   ```bash
   node prisma/seed.js
   ```

### Step 3: Deploy to Vercel
1. Push your repository to GitHub / GitLab.
2. Log in to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
3. Import the `Hopenix-School` repository.
4. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: Secret key for signing authentication tokens.
   - `BLOB_READ_WRITE_TOKEN`: *(Optional)* Vercel Blob read/write token if using Vercel Blob file attachments.
5. In **Build Settings**, set:
   - **Build Command**: `npx prisma generate && vite build`
   - **Output Directory**: `dist`
6. Click **Deploy**.

---

## 3. Production Default Credentials

After running `node prisma/seed.js`, the default initial accounts created are:

### Admin Credentials
- **Email**: `admin@hopenix.edu`
- **Password**: `Admin@123`
- **Portal URL**: `/admin/login`

### Teacher Credentials
- **Email**: `teacher@hopenix.edu`
- **Password**: `Teacher@123`
- **Portal URL**: `/teacher/login`

> [!IMPORTANT]
> Immediately log in to `/admin` and update the default passwords for production security.

---

## 4. System Architecture & Vercel API Endpoints

To remain strictly within Vercel's **Hobby Plan limit** (maximum 12 Serverless Functions per deployment), all API endpoints are consolidated into a **single Vercel Serverless Function entrypoint** (`/api/index.js`). Individual route handlers are organized in `/api/lib/handlers/` and routed internally.

This guarantees that the entire backend counts as **1 single Serverless Function** on Vercel deployment.

| Endpoint | Method(s) | Description |
| :--- | :--- | :--- |
| `/api/auth` | `POST`, `GET` | Login, session verification (`action=me`), password update |
| `/api/admin` | `GET` | Admin dashboard analytics & SQL aggregate statistics |
| `/api/teachers` | `GET`, `POST`, `PUT`, `DELETE` | Teacher CRUD, status toggling, and account reset |
| `/api/classes` | `GET`, `POST`, `PUT`, `DELETE` | Classes, Sections, and Subjects management |
| `/api/assignments` | `GET`, `POST`, `DELETE` | Assign teachers to Class, Section, and Subject combinations |
| `/api/diary` | `GET`, `POST`, `PUT`, `DELETE` | Daily Diary CRUD with teacher assignment verification |
| `/api/uploads` | `POST` | Attachment & image upload handler (Vercel Blob / Data URLs) |
| `/api/events` | `GET`, `POST`, `PUT`, `DELETE` | School events CRUD (SQL-backed) |
| `/api/admissions` | `GET`, `POST`, `PUT`, `DELETE` | Admission form submissions and admin status workflows |
| `/api/students` | `GET` | Enrolled student rosters and statistics |
| `/api/settings` | `GET`, `PUT` | General school branding and contact configuration |
| `/api/health` | `GET` | Database & API health check endpoint |

---

## 5. Verification Checklist

- [x] **Public Site**: Home, About, Academics, Events, Admissions, and Contact pages render with existing UI theme.
- [x] **Public Daily Diary (`/daily-diary`)**: Parents can filter by Class, Section, Subject, and Date to view homework and attachments without needing an account.
- [x] **Admin Portal (`/admin`)**: Admin can log in, view real-time SQL dashboard stats, manage teachers, assign duties, customize classes/sections/subjects, and review admissions.
- [x] **Teacher Portal (`/teacher`)**: Teacher can log in, see assigned classes/sections/subjects, publish daily homework, and edit/delete own entries.
- [x] **Teacher Security Enforcement**: Serverless `/api/diary` rejects attempts by teachers to publish for unassigned classes or subjects with `403 Forbidden`.
- [x] **SQL Storage**: Events, admissions, daily diary entries, and user accounts persist in SQL relational database via Prisma ORM.

---

## 6. Troubleshooting Common Issues

### Issue 1: `PrismaClientInitializationError` / Cannot Connect to Database
- **Cause**: Incorrect `DATABASE_URL` or missing SSL mode.
- **Solution**: Ensure your connection string includes `?sslmode=require` and test connectivity using `npx prisma db pull`.

### Issue 2: `403 Forbidden` on Teacher Diary Submission
- **Cause**: The logged-in teacher is attempting to publish for a Class, Section, or Subject not assigned to them in `TeacherAssignment`.
- **Solution**: Log into `/admin/teachers`, click **+ Assign Class** next to the teacher, and assign the relevant Class, Section, and Subject.

### Issue 3: Vercel Build Fails on `@prisma/client`
- **Cause**: Prisma Client standard binaries were not generated during deployment build.
- **Solution**: Set Vercel Build Command to `npx prisma generate && vite build`.

---

## 7. Useful Operational Commands

```bash
# Validate Prisma schema
npx prisma validate

# Re-generate Prisma Client
npx prisma generate

# Execute database migrations
npx prisma db push

# Run local development server (Frontend + Serverless API)
npm run dev

# Build production bundle
npm run build
```
