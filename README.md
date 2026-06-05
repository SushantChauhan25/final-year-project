[README.md](https://github.com/user-attachments/files/28629184/README.md)
# RecruitFlow — Recruitment SaaS Platform

A full-stack recruitment pipeline application built with **React + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Features

| Module | Roles | Description |
|--------|-------|-------------|
| Auth | All | Register / login with JWT, role-based routing |
| Candidate Dashboard | Candidate | Track application stages, view feedback |
| Profile Editor | Candidate | Headline, skills, bio, GitHub/LinkedIn, resume URL |
| Coding Arena | Candidate | Monaco editor, run via Judge0, submit for review |
| HR Review Panel | HR / Admin | Approve / reject applications with feedback |
| Tech Review Panel | Tech / Admin | View submitted code, approve or reject |
| Offer Generation | Admin | Generate and dispatch offer letters |
| Community Feed | All | Post updates, like, comment |

---

## Project Structure

```
finalproject/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- (Optional) Judge0 RapidAPI key for live code execution

---

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI, JWT_SECRET, and optionally JUDGE0_API_KEY
npm install
npm run dev        # starts with nodemon on port 5000
```

**`.env` variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Any strong random string |
| `PORT` | No | Default: 5000 |
| `JUDGE0_API_KEY` | No | RapidAPI key for live code execution |
| `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` | No | SMTP for offer emails |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # Vite dev server on port 5173
```

The frontend proxies API calls to `http://localhost:5000/api` by default. Override with `VITE_API_URL` in a `.env` file.

---

## Usage Flow

1. **Register** with role `candidate` → fill in your profile
2. **Register/login** as `hr` → approve candidates from HR Review Panel
3. Candidate logs in → Coding Arena unlocks → submit code
4. **Login** as `tech` → review submission → approve
5. **Login** as `admin` → generate offer letter

> **Quick demo:** Register one account per role — `candidate`, `hr`, `tech`, `admin` — and walk through the full pipeline.

---

## Fixes Applied (v2)

### Backend
- ✅ All controllers wrapped in `try/catch` → errors forwarded to global handler
- ✅ `server.js` error handler signature corrected (`err, req, res, next`)
- ✅ `compilerController` gracefully handles missing Judge0 key instead of crashing
- ✅ `offerController` PDF/email failures are non-fatal (warns, continues)
- ✅ `candidateController` `updateProfile` correctly handles `resumeUrl: ''` (no-op guard removed)

### Frontend
- ✅ `App.jsx` — Navbar hidden on `/login` and `/register` routes
- ✅ `main.jsx` — verified `BrowserRouter` wraps `AuthProvider` correctly
- ✅ `AuthContext.jsx` — `setLoading(false)` called when no token exists (prevents infinite spinner)
- ✅ `AdminPanel.jsx` — loading states per section; offer list filtered correctly to `tech_passed` candidates
- ✅ `OfferLetterModal.jsx` — loading state, validation, error display, success feedback, cancel button
- ✅ `CodingArena.jsx` — submit disabled after first submission; better error messages; tab-switch counter improved

---

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in, get JWT |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/candidate/profile` | candidate | Dashboard data + active test |
| PUT | `/api/candidate/profile` | candidate | Update profile |
| GET | `/api/hr/applications` | hr/admin | Pending candidates |
| POST | `/api/hr/evaluate/:id` | hr/admin | Approve or reject |
| POST | `/api/code/run` | any | Run code via Judge0 |
| POST | `/api/code/submit` | candidate | Submit final code |
| GET | `/api/tech/submissions` | tech/admin | All submissions |
| POST | `/api/tech/review/:id` | tech/admin | Approve or reject |
| POST | `/api/final/offer/:id` | hr/admin | Generate offer letter |
| GET | `/api/posts` | any | Feed posts |
| POST | `/api/posts` | any | Create post |
| PUT | `/api/posts/like/:id` | any | Toggle like |
| POST | `/api/posts/comment/:id` | any | Add comment |
| DELETE | `/api/posts/:id` | any | Delete own post |
