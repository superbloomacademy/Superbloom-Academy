# Vercel Deployment Guide for Superbloom Academy

This guide explains how to deploy **all three apps** to Vercel without sleep mode:

- Public **frontend** (Vite React) – `frontend/`
- **Admin** panel (Vite React) – `admin/`
- **Backend API** (Express + MongoDB) – `backend/` (serverless on Vercel)

---

## 1. Prerequisites

1. Vercel account (`https://vercel.com`)
2. Code pushed to GitHub/GitLab/Bitbucket
3. MongoDB database (MongoDB Atlas recommended)
4. Cloudinary account for image uploads

You will create **3 separate Vercel projects**:

- `superbloom-backend` → root `backend`
- `superbloom-frontend` → root `frontend`
- `superbloom-admin` → root `admin`

---

## 2. Backend API (Express + MongoDB) – `backend/`

The backend is deployed as **serverless functions** on Vercel, using:

- `backend/api/index.js` – serverless entry that wraps your Express `app`
- `backend/vercel.json` – routes all requests to the API

### 2.1 Create Backend Project

1. Go to Vercel Dashboard → **Add New → Project**
2. Import this repository
3. When asked for settings:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

> The `backend/vercel.json` and `backend/api/index.js` are already set up in this repo.

### 2.2 Backend Environment Variables

Copy **everything** from your local `.env` file into the Vercel backend project:

Required (based on `server.js` and `app.js`):

- `MONGO_URI` – MongoDB connection string
- `JWT_ACCESS_SECRET` – secret for access tokens
- `JWT_REFRESH_SECRET` – secret for refresh tokens
- `CLOUD_NAME` – Cloudinary cloud name
- `CLOUD_API_KEY` – Cloudinary API key
- `CLOUD_API_SECRET` – Cloudinary API secret
- `CLIENT_URL` – public frontend URL (set after frontend deploy)
- `ADMIN_URL` – admin panel URL (set after admin deploy)
- `NODE_ENV` – `production` (optional, but recommended)

> **Note:** `PORT` is **not** needed on Vercel (serverless decides the port).

### 2.3 Deploy Backend

1. Click **Deploy** in the backend project
2. Wait for deployment to finish
3. Copy the backend URL, e.g.:
   - `https://your-backend.vercel.app`
   - `https://superbloom-academy-opal.vercel.app/`

You will use this URL as `VITE_API_BASE` / `VITE_API_URL` in the frontend and admin.

---

## 3. Frontend (Public Site) – `frontend/`

The frontend is a Vite React app. It already has:

- `frontend/vercel.json` – SPA rewrite to `index.html`
- API usage via:
  - `src/utils/api.js` → `baseURL: \`${import.meta.env.VITE_API_BASE}/api\``
  - `Contact.jsx` → uses `VITE_API_URL` for `/api/public/contact`

### 3.1 Create Frontend Project

1. In Vercel Dashboard → **Add New → Project**
2. Import the **same** repository
3. Settings:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.2 Frontend Environment Variables

In the **frontend** Vercel project → **Settings → Environment Variables**:

- `VITE_API_BASE` = `https://your-backend.vercel.app`
- `VITE_API_URL`  = `https://your-backend.vercel.app`

> **Important:** Do **not** add `/api` to the end; the code already appends `/api`.

### 3.3 Deploy Frontend

1. Click **Deploy**
2. When complete, note the frontend URL, e.g.:
   - `https://your-frontend.vercel.app`
   -`https://superbloom-academy-frontend.vercel.app/`

You will put this URL in `CLIENT_URL` in the backend project.

---

## 4. Admin Panel – `admin/`

The admin app is also Vite React and talks to the same backend using:

- `admin/src/utils/api.js` → `baseURL: \`${import.meta.env.VITE_API_BASE}/api\``

### 4.1 Create Admin Project

1. In Vercel Dashboard → **Add New → Project**
2. Import the same repository
3. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.2 Admin Environment Variables

In the **admin** Vercel project → **Settings → Environment Variables**:

- `VITE_API_BASE` = `https://your-backend.vercel.app`

### 4.3 Deploy Admin

1. Click **Deploy**
2. When complete, note the admin URL, e.g.:
   - `https://your-admin.vercel.app`
   - `https://superbloom-academy-admin.vercel.app/login`

You will put this URL in `ADMIN_URL` in the backend project.

---

## 5. Wire Up CORS (Backend ↔ Frontend/Admin)

Your backend CORS config (`backend/app.js`) checks:

- `process.env.CLIENT_URL`
- `process.env.ADMIN_URL`

After you know the final URLs:

1. Go to **Backend project → Settings → Environment Variables**
2. Set:
   - `CLIENT_URL` = `https://your-frontend.vercel.app` (or your custom domain)
   - `https://superbloom-academy-frontend.vercel.app/`


   - `ADMIN_URL`  = `https://your-admin.vercel.app` (or your admin domain)
   - `https://superbloom-academy-admin.vercel.app/login`
3. Click **Redeploy** backend

Now only requests from those origins will be allowed.

---

## 6. Custom Domains (Optional but Recommended)

### 6.1 Frontend Custom Domain

1. In **frontend** project → **Settings → Domains**
2. Add `www.superbloomacademy.in`
3. Follow Vercel’s DNS instructions (usually a CNAME to `cname.vercel-dns.com`)
4. Once live, update in **backend env**:
   - `CLIENT_URL` = `https://www.superbloomacademy.in`

### 6.2 Backend Custom Domain

1. In **backend** project → **Settings → Domains**
2. Add e.g. `api.superbloomacademy.in`
3. Configure DNS as instructed
4. Update in **frontend** and **admin** env vars:
   - `VITE_API_BASE` = `https://api.superbloomacademy.in`
   - `VITE_API_URL`  = `https://api.superbloomacademy.in` (frontend only)

### 6.3 Admin Custom Domain

1. In **admin** project → **Settings → Domains**
2. Add e.g. `admin.superbloomacademy.in`
3. Configure DNS
4. Update **backend env**:
   - `ADMIN_URL` = `https://admin.superbloomacademy.in`

Redeploy affected projects after changing environment variables.

---

## 7. Environment Variables – Full Summary

### 7.1 Backend (Vercel project: `backend`)

From `.env` into Vercel:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=https://your-frontend.vercel.app      # or custom domain
ADMIN_URL=https://your-admin.vercel.app          # or custom domain
NODE_ENV=production
```

### 7.2 Frontend (Vercel project: `frontend`)

```bash
VITE_API_BASE=https://your-backend.vercel.app    # or api.superbloomacademy.in
VITE_API_URL=https://your-backend.vercel.app     # or api.superbloomacademy.in
```

### 7.3 Admin (Vercel project: `admin`)

```bash
VITE_API_BASE=https://your-backend.vercel.app    # or api.superbloomacademy.in
```

---

## 8. Troubleshooting

### 8.1 Backend Issues

**MongoDB connection errors**

- Check `MONGO_URI` is correct
- In MongoDB Atlas, allow IPs from anywhere (`0.0.0.0/0`) or Vercel’s IP range
- Verify username/password and database name in the URI

**CORS errors**

- Ensure `CLIENT_URL` and `ADMIN_URL` exactly match the deployed origins
- Check scheme (`https://`), subdomain, and no trailing slash

**Function timeouts**

- Free Vercel plan has limited function duration
- Optimize DB queries and heavy work
- Upgrade plan if you need longer timeouts

### 8.2 Frontend/Admin Issues

**API calls failing**

- Check `VITE_API_BASE` / `VITE_API_URL` values
- Inspect browser DevTools → Network tab for errors
- Make sure backend project is deployed and healthy

**Routing / 404 on refresh**

- `frontend/vercel.json` handles SPA routing:
  - rewrites `/(.*)` → `/index.html`
- For admin, consider adding a similar `vercel.json` in `admin/` if you have nested routes

---

## 9. Quick Checklist

1. **Backend**
   - [ ] Create Vercel project with root `backend`
   - [ ] Set all `.env` values as environment variables
   - [ ] Deploy and note backend URL
2. **Frontend**
   - [ ] Create Vercel project with root `frontend`
   - [ ] Set `VITE_API_BASE` and `VITE_API_URL` to backend URL
   - [ ] Deploy and note frontend URL
3. **Admin**
   - [ ] Create Vercel project with root `admin`
   - [ ] Set `VITE_API_BASE` to backend URL
   - [ ] Deploy and note admin URL
4. **CORS + Domains**
   - [ ] Update `CLIENT_URL` and `ADMIN_URL` in backend env
   - [ ] Optionally add custom domains for all three projects
   - [ ] Redeploy affected projects

Once all boxes are checked, your frontend, admin, and backend will all run on Vercel with **no sleep mode** and share a single API.
