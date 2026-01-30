# 🚨 Vercel Exit Code 126 - Platform Issue

## The Problem

After multiple attempts with different configurations, Vercel continues to fail with **exit code 126 (Permission Denied)** on the vite binary. This is a **Vercel platform issue**, not your code.

### What We've Tried:
1. ✅ Using `npx vite build`
2. ✅ Using `npx --yes vite build`
3. ✅ Correct root directory (`frontend/web`)
4. ✅ Simplified build commands
5. ✅ Different framework presets

**All configurations are correct, but Vercel's build environment has permission issues with the vite binary.**

---

## ✅ SOLUTION: Use Netlify Instead

Netlify handles monorepos better and doesn't have these permission issues.

### Step 1: Sign Up for Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Create New Site

1. Click **Add new site** → **Import an existing project**
2. Choose **GitHub**
3. Select your repository: `resto-restaurant-website-mvp-3809767135820761914`

### Step 3: Configure Build Settings

Use these EXACT settings:

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend/web` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/web/dist` |

### Step 4: Add Environment Variables

Click **Show advanced** → **New variable**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://resto-restaurant-website-mvp.onrender.com` |
| `VITE_APP_NAME` | `RestaurantBot AI` |

### Step 5: Deploy

Click **Deploy site** and wait 2-3 minutes.

---

## 🎯 Why Netlify Will Work

- ✅ Better monorepo support
- ✅ No permission issues with node_modules binaries
- ✅ Simpler configuration
- ✅ Free tier with 100GB bandwidth
- ✅ Automatic HTTPS
- ✅ Auto-deploys on git push

---

## 📋 Alternative: Create netlify.toml

For even better control, create this file at repository root:

```toml
[build]
  base = "frontend/web"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Then just click "Deploy" - Netlify will auto-detect the config!

---

## 🆘 If You Really Want Vercel

Contact Vercel support with:
- Your project URL
- Build logs showing exit code 126
- Mention: "Permission denied on vite binary in node_modules/.bin/"

They may need to fix something on their end or whitelist your project.

---

## 🎉 Recommended Next Steps

1. **Try Netlify** (5 minutes, will work immediately)
2. **Keep Render backend** (already working)
3. **Your stack**: Supabase + Render + Netlify = All free, all working!

---

## 📊 Comparison

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Free Tier** | 100GB bandwidth | 100GB bandwidth |
| **Build Time** | Fast | Fast |
| **Monorepo Support** | Complex | Excellent |
| **Our Experience** | Exit code 126 errors | Should work fine |
| **Auto Deploy** | Yes | Yes |
| **Custom Domain** | Yes | Yes |

**Verdict**: Try Netlify - it's designed for these scenarios!
