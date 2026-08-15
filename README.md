# InstaCut Pro

An AI background-removal studio: remove or replace backgrounds (solid color,
gradient, blurred original), batch-process up to 20 images at once, keep a
gallery of past results, and call the same pipeline from a public API.

Built as an upgrade on [InstaCut](https://github.com/mithilgirish/InstaCut) —
same core idea (AI background removal), with a real backend (auth, a
database, a queue-free batch pipeline, an API), more editing modes, and a
different visual direction.

## Stack

- **Backend:** FastAPI + [rembg](https://github.com/danielgatis/rembg)
  (isnet-general-use model) for the actual cutout, SQLite for storage, JWT
  auth.
- **Frontend:** React + Vite + Tailwind, React Router.

Everything below runs on free tiers — no credit card needed anywhere.

## 1. Run it locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit JWT_SECRET if you want
uvicorn main:app --reload --port 8000
```

First request that processes an image will download the rembg model
(~170MB, one-time, cached locally). The API is now at
`http://localhost:8000` — check `http://localhost:8000/health`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env            # VITE_API_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:5173`.

## 2. Push to GitHub

From the project root (`instacut-pro/`):

```bash
git init
git add .
git commit -m "Initial commit: InstaCut Pro"
```

Create a new empty repo on GitHub (github.com → New repository — don't
initialize it with a README, since you already have one), then:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/instacut-pro.git
git push -u origin main
```

If you don't have `git` configured yet:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

The `.gitignore` already excludes `node_modules`, the SQLite database,
`.env` files, and processed uploads — so secrets and generated files never
get committed.

## 3. Deploy for free

**Backend → [Render](https://render.com) free tier**
1. New → Web Service → connect your GitHub repo → root directory `backend`.
2. Render auto-detects `render.yaml`, or set manually: build command
   `pip install -r requirements.txt`, start command
   `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Add environment variable `CORS_ORIGINS` = your Vercel URL (step below)
   once you have it.
4. Free tier spins down when idle — the first request after a break takes
   ~30–50s to wake up. Fine for a portfolio project.

**Frontend → [Vercel](https://vercel.com) free tier**
1. New Project → import the same repo → root directory `frontend`.
2. Vercel auto-detects Vite. Add environment variable
   `VITE_API_URL` = your Render backend URL.
3. Deploy. `vercel.json` is already set up so client-side routing
   (`/studio`, `/gallery`) works on refresh.

**Database** — SQLite ships with the backend, no separate service needed.
If you outgrow it, [Supabase](https://supabase.com) and
[Neon](https://neon.tech) both have free Postgres tiers — just swap
`DATABASE_URL` in the backend `.env`.

## Notes on the free-tier tradeoffs

- rembg runs on CPU on Render's free tier — expect 3–8s per image, which is
  fine for a demo but not production scale.
- Credits are a simple counter (50 free per account) with no real payment
  integration wired up — that's the natural next thing to add (Stripe or
  Razorpay both have test modes that cost nothing during development).
- Uploaded files live on the backend's local disk, which is wiped on every
  Render free-tier redeploy. For anything you want to persist long-term,
  swap the `uploads/` writes for Cloudflare R2 (10GB free) or Supabase
  Storage.

## API

Every account gets an API key (`GET /me` after logging in). Programmatic
access:

```bash
curl -X POST https://your-backend.onrender.com/v1/remove-bg \
  -H "X-API-Key: sk_live_..." \
  -F "file=@photo.jpg" \
  -F "mode=transparent" \
  --output result.png
```
