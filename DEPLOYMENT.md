# Production Deployment Guide: Hopenix School Management & Daily Diary System

This guide outlines the step-by-step process for deploying the **Hopenix School React Website & Daily Diary System** to **Vercel** with a **PostgreSQL database** (Neon.tech or Supabase).

---

## 1. Prerequisites

- A [Vercel Account](https://vercel.com)
- A [Neon PostgreSQL Account](https://neon.tech) OR [Supabase Account](https://supabase.com)
- Node.js 18+ and Git installed on your system

---

## 2. PostgreSQL Database Setup (Neon / Supabase)

### Option A: Neon PostgreSQL (Recommended)

1. Log in to [Neon.tech](https://neon.tech) and create a new project named `hopenix-school`.
2. Copy the provided connection string. It will look like:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Set `DIRECT_URL` to the exact same URL or unpooled direct connection URL.

### Option B: Supabase PostgreSQL

1. Log in to [Supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings -> Database**, locate the Connection String (URI format).
3. Set `DATABASE_URL` with transaction pooling mode (port 6543) and `DIRECT_URL` with direct connection mode (port 5432).

---

## 3. Local Environment Configuration

Copy `.env.example` to `.env` in your repository root:

```bash
cp .env.example .env
```

Fill in your actual PostgreSQL database credentials:

```env
DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="your-random-secure-jwt-secret-key-32-chars"
```

---

## 4. Run Prisma Database Migration & Seeding

Run the following commands to initialize your PostgreSQL database schema and seed default Admin/Teacher data:

```bash
# Generate Prisma Client
npx prisma generate

# Apply schema migrations to PostgreSQL database
npx prisma db push

# Seed default admin, teacher, classes, sections, and subjects
npm run db:seed
```

### Seeded Credentials:

- **Admin Account**:
  - Email: `admin@hopenix.edu.pk`
  - Password: `Admin@123456`
- **Teacher Account**:
  - Email: `ahmed@hopenix.edu.pk`
  - Password: `Teacher@123456`

---

## 5. File Upload Storage Setup (Vercel Blob)

1. In your Vercel Dashboard, navigate to your project's **Storage** tab.
2. Click **Create Database / Storage** -> Select **Vercel Blob**.
3. Once created, Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables.

---

## 6. Deploying to Vercel

1. **Push your repository** to GitHub/GitLab:
   ```bash
   git add .
   git commit -m "Upgrade React school website with SQL Daily Diary & Management system"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New...** -> **Project**.
   - Select your repository `Hopenix-School`.

3. **Configure Environment Variables** in Vercel:
   Add the following variables under **Settings -> Environment Variables**:
   - `DATABASE_URL` = *(Your Neon/Supabase PostgreSQL connection string)*
   - `DIRECT_URL` = *(Your Direct connection string)*
   - `AUTH_SECRET` = *(Your secure random string)*
   - `BLOB_READ_WRITE_TOKEN` = *(Your Vercel Blob token)*

4. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend and deploy the **12 Serverless API Functions** under `/api/*`.

---

## 7. Serverless API Action Limits

The entire backend is structured around **12 Vercel Serverless Functions**:

1. `/api/auth` — Login, logout, session check (`me`), password update
2. `/api/admin` — Admin dashboard aggregations and metrics
3. `/api/teachers` — Teacher account CRUD & password resets
4. `/api/classes` — Classes, Sections, & Subjects CRUD
5. `/api/assignments` — Teacher class & subject assignments
6. `/api/diary` — Daily diary CRUD, filtering, and authorization checks
7. `/api/uploads` — Attachment file upload handler
8. `/api/events` — SQL Events management
9. `/api/admissions` — Admission application submission & management
10. `/api/students` — Student & class rosters
11. `/api/settings` — School settings configuration
12. `/api/health` — Database health check endpoint

---

## 8. Verification Checklist

After deployment, perform these verification checks on your live site:

- [ ] Public site loads without errors.
- [ ] Navigating to `/daily-diary` shows class & section selectors.
- [ ] Admin login at `/admin/login` works using `admin@hopenix.edu.pk`.
- [ ] Teacher login works using `ahmed@hopenix.edu.pk`.
- [ ] Admin can create a new Teacher account and assign Grade & Subject.
- [ ] Teacher sees only assigned classes in the `/teacher/diary` portal.
- [ ] Teacher can upload a Daily Diary entry with an optional attachment.
- [ ] Public users/parents can view the uploaded diary on `/daily-diary`.
- [ ] Admission applications submitted on `/admissions/apply` write to PostgreSQL and appear in Admin panel `/admin/admissions`.
- [ ] Events edited in `/admin/events` update on the public `/events` page.

---

## 9. Troubleshooting

### 1. `PrismaClientInitializationError: Unable to connect to database`
- Verify `DATABASE_URL` and `DIRECT_URL` in Vercel environment variables.
- Ensure Neon database is active and IP restrictions are not blocking Vercel serverless IPs.
- Make sure `?sslmode=require` is appended to the connection string.

### 2. `403 Forbidden` on Teacher Diary Upload
- The server checks whether the teacher is assigned to the selected Class + Section + Subject.
- Ensure Admin has assigned that combination to the teacher under `/admin/teachers`.

### 3. Vercel Build Error `Prisma Client has not been generated`
- The build script in `package.json` is configured as `"build": "prisma generate && vite build"`.
- Ensure `npx prisma generate` runs during the build step.

### 4. File Upload Issues
- If `BLOB_READ_WRITE_TOKEN` is missing, uploads will fall back to base64 encoding. Set `BLOB_READ_WRITE_TOKEN` in Vercel settings for production storage.
