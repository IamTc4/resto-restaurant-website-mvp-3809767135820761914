# Cloudflare Pages Deployment Guide

## 🚀 Alternative to Vercel/Netlify

Since Vercel has permission issues and Netlify is down, use **Cloudflare Pages** - it's fast, free, and handles monorepos well.

---

## Step 1: Sign Up for Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up with GitHub
3. Authorize Cloudflare to access your repositories

---

## Step 2: Create New Project

1. Click **Create a project**
2. Select **Connect to Git**
3. Choose your repository: `resto-restaurant-website-mvp-3809767135820761914`
4. Click **Begin setup**

---

## Step 3: Configure Build Settings

Use these EXACT settings:

| Setting | Value |
|---------|-------|
| **Project name** | `resto-restaurant-mvp` (or your choice) |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `frontend/web` |

---

## Step 4: Add Environment Variables

Click **Add variable** for each:

| Variable | Value |
|-----|-------|
| `NODE_VERSION` | `18` |
| `VITE_API_URL` | `https://resto-restaurant-website-mvp.onrender.com` |
| `VITE_APP_NAME` | `RestaurantBot AI` |

---

## Step 5: Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes for build
3. Your app will be live at: `https://resto-restaurant-mvp.pages.dev`

---

## ✅ Why Cloudflare Pages Works

- ✅ No permission issues with node_modules
- ✅ Excellent monorepo support
- ✅ Free tier: Unlimited bandwidth!
- ✅ Fast global CDN
- ✅ Auto-deploys on git push
- ✅ Free SSL/HTTPS

---

## 📋 Create wrangler.toml (Optional)

For configuration as code, create this at repository root:

```toml
name = "resto-restaurant-mvp"
pages_build_output_dir = "frontend/web/dist"

[build]
command = "cd frontend/web && npm install && npm run build"

[env.production]
vars = { NODE_VERSION = "18" }
```

---

## 🎯 Expected Build Output

```
Initializing build environment
Installing dependencies
> npm install

Building application
> npm run build

vite v4.3.9 building for production...
✓ built in 12s

Success! Uploaded 15 files
Deployed to https://resto-restaurant-mvp.pages.dev
```

---

## 🆘 Alternative: Vercel CLI (Bypass Dashboard)

If you want to stick with Vercel, try deploying via CLI:

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy
```bash
cd frontend/web
vercel --prod
```

This bypasses the dashboard and might avoid permission issues.

---

## 📊 Platform Comparison

| Platform | Status | Bandwidth | Issue |
|----------|--------|-----------|-------|
| **Vercel** | ❌ Failing | 100GB | Exit code 126 |
| **Netlify** | ⚠️ Down | 100GB | Service outage |
| **Cloudflare Pages** | ✅ Working | Unlimited | None |

**Recommendation**: Use Cloudflare Pages!

---

## 🎉 Final Stack

- ✅ **Database**: Supabase
- ✅ **Backend**: Render (live!)
- ✅ **Frontend**: Cloudflare Pages (recommended)

All free, all reliable, all working! 🚀
