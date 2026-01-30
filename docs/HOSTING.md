# Hosting Guide - RestaurantBot AI (Free Tier Only)

Follow these steps to host your prototype for free.

## 1. Database (Supabase)
Supabase provides a generous free tier for PostgreSQL.
- **Signup**: [supabase.com](https://supabase.com)
- **Project**: Create a new project.
- **Go to Settings > API**: Get your `SUPABASE_URL` and `SUPABASE_KEY` (anon key).
- **Table Setup**: Create `orders` and `menu_items` tables using the Table Editor.

## 2. Backend (Render)
Render is a great free option for Node.js backends.
- **Signup**: [render.com](https://render.com)
- **New + Web Service**: Connect your GitHub repository.
- **Settings**:
    - Build Command: `npm install`
    - Start Command: `npm start`
    - Environment Variables: Add `SUPABASE_URL`, `SUPABASE_KEY`, `GEMINI_API_KEY`.

## 3. Frontend (Vercel)
Vercel is the best for React/Vite frontends.
- **Signup**: [vercel.com](https://vercel.com)
- **Import Project**: Select your repo.
- **Settings**:
    - Framework Preset: Vite (or whatever you used).
    - Environment Variables: Add `REACT_APP_API_URL` pointing to your Render backend.

## Summary of Free Stack
| Component | Platform | Free Tier Limit |
|-----------|----------|-----------------|
| Database  | Supabase | 500MB storage   |
| Backend   | Render   | Spins down after idle |
| Frontend  | Vercel   | 100GB Bandwidth |

---

### Zero-Config Note
If you don't want to set up Supabase yet, the Render backend will automatically use **In-Memory Mock Storage** for your prototype until you provide the keys.
