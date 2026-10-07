# Superbloom Academy

Three apps in one repository. Each is its own Vercel project with its folder as the root directory.

| Folder | What it is | Stack | Local URL |
|---|---|---|---|
| `frontend/` | Public website, www.superbloomacademy.in | Next.js, Tailwind | http://localhost:3000 |
| `admin/` | Admin panel, admin.superbloomacademy.in | React, Vite, Tailwind | http://localhost:5175 |
| `backend/` | API and database access | Express, MongoDB | http://localhost:5000 |
| `docs/` | Launch, deployment and SEO guides | Markdown | |

## Run locally

Each app needs its own `.env` (copy the `.env.example` beside it; the frontend uses `.env.local`).

```bash
cd backend  && npm install && npm run dev    # start this first
cd frontend && npm install && npm run dev
cd admin    && npm install && npm run dev
```

## Where things live

```
frontend/
  public/            logo, share banner (og.jpg)
    images/about/    photos used on the About page
    images/team/     contributor portraits
    videos/          workshop clip and its poster
  src/app/           one folder per page (routes)
  src/components/    shared UI
  src/lib/           site details, programme content, SEO helpers
admin/src/           pages and components of the admin panel
backend/
  api/               Vercel entry point
  controllers/       request handlers
  models/            MongoDB schemas
  routes/            URL routing
  middleware/        auth, rate limits, uploads
  utils/             helpers, including workshop emails (mailer.js, workshopEmails.js)
```

## Guides

- `docs/LAUNCH-CHECKLIST.md`: what to do before and after going live
- `docs/VERCEL-DEPLOYMENT-GUIDE.md`: Vercel projects and environment variables
- `docs/SEO-KEYWORDS-AND-CONTENT.md`: the keyword each page targets
