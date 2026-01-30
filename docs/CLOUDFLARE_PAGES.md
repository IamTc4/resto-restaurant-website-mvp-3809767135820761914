# Cloudflare Pages vs Workers - Fix Configuration

## 🚨 The Problem

You're in **Cloudflare Workers** settings, but you need **Cloudflare Pages**!

- **Workers** = Backend serverless functions (like AWS Lambda)
- **Pages** = Frontend static site hosting (like Vercel/Netlify)

Your React/Vite app needs **Pages**, not Workers!

---

## ✅ Correct Setup: Use Cloudflare Pages

### Step 1: Go to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Workers & Pages** in left sidebar
3. Click **Create application**
4. Select **Pages** tab (NOT Workers!)
5. Click **Connect to Git**

### Step 2: Connect Repository

1. Authorize Cloudflare to access GitHub
2. Select repository: `IamTc4/resto-restaurant-website-mvp-3809767135820761914`
3. Click **Begin setup**

### Step 3: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Project name** | `resto-restaurant-mvp` |
| **Production branch** | `main` |
| **Framework preset** | `None` (or `Vite` if available) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory (advanced)** | `frontend/web` |

### Step 4: Environment Variables

Click **Add variable**:

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `18` |
| `VITE_API_URL` | `https://resto-restaurant-website-mvp.onrender.com` |
| `VITE_APP_NAME` | `RestaurantBot AI` |

### Step 5: Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes
3. Your app will be live at: `https://resto-restaurant-mvp.pages.dev`

---

## 🎯 Key Differences

| Feature | Workers | Pages |
|---------|---------|-------|
| **Purpose** | Backend APIs | Frontend static sites |
| **Deploy Command** | `wrangler deploy` | Automatic |
| **Output** | JavaScript functions | HTML/CSS/JS files |
| **Your Need** | ❌ No | ✅ Yes |

---

## 📋 If You Already Created a Worker

Delete it and start fresh with Pages:

1. In Workers dashboard, scroll to bottom
2. Click **Delete Worker**
3. Go back and create a **Pages** project instead

---

## ✅ Expected Success

After creating Pages project:

```
✓ Build successful
✓ Deploying to Cloudflare Pages
✓ Deployment complete

Your site is live at:
https://resto-restaurant-mvp.pages.dev
```

---

## 🆘 Quick Navigation

- **Pages Dashboard**: https://dash.cloudflare.com → Workers & Pages → Pages tab
- **Create Pages**: https://dash.cloudflare.com/pages

Make sure you're on the **Pages** tab, not Workers!
