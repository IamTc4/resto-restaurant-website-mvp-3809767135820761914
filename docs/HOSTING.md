# Hosting Guide - RestaurantBot AI (Free Tier)

Complete step-by-step guide to deploy your restaurant AI application using free hosting platforms.

---

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ GitHub account with your code pushed to a repository
- ✅ All environment variables ready (API keys, database credentials)
- ✅ Basic understanding of your project structure

---

## 🗂️ Project Structure Overview

This is a **monorepo** with separate backend and frontend:

```
resto-restaurant-website-mvp/
├── backend/              # Node.js/Express API
│   ├── package.json
│   └── server.js
├── frontend/
│   └── web/             # React/Vite frontend
│       ├── package.json
│       └── src/
├── render.yaml          # Render configuration
└── vercel.json          # Vercel configuration
```

> **Important**: The configuration files (`render.yaml` and `vercel.json`) at the root tell each platform where to find the correct code.

---

## 1️⃣ Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `restaurantbot-db` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get API Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_KEY`

### Step 3: Create Database Tables
1. Go to **Table Editor** in the sidebar
2. Click **"New Table"**
3. Create the following tables:

#### Table: `menu_items`
```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `orders`
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

✅ **Database setup complete!**

---

## 2️⃣ Backend Deployment (Render)

### Step 1: Connect GitHub Repository
1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Select your repository: `resto-restaurant-website-mvp-3809767135820761914`

### Step 2: Configure Service
Since we have a `render.yaml` file, Render will auto-detect the configuration. But verify these settings:

- **Name**: `restaurantbot-backend`
- **Region**: Oregon (US West) or closest to you
- **Branch**: `main`
- **Root Directory**: `backend` *(auto-configured)*
- **Environment**: `Node`
- **Build Command**: `npm install` *(auto-configured)*
- **Start Command**: `npm start` *(auto-configured)*
- **Plan**: `Free`

### Step 3: Add Environment Variables
Click **"Environment"** tab and add:

| Key | Value | Where to get it |
|-----|-------|-----------------|
| `NODE_ENV` | `production` | Static value |
| `SUPABASE_URL` | `https://xxx.supabase.co` | From Supabase Settings → API |
| `SUPABASE_KEY` | `eyJhbGc...` | From Supabase Settings → API (anon key) |
| `GEMINI_API_KEY` | `AIzaSy...` | From [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `PORT` | `10000` | Static value (Render default) |

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Once deployed, copy your backend URL: `https://restaurantbot-backend.onrender.com`

### Step 5: Test Backend
Visit: `https://your-backend-url.onrender.com/health`

You should see: `{"status": "ok"}` or similar response.

✅ **Backend deployed!**

---

## 3️⃣ Frontend Deployment (Vercel)

### Step 1: Import Project
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select: `resto-restaurant-website-mvp-3809767135820761914`

### Step 2: Configure Build Settings
Vercel will auto-detect the `vercel.json` configuration. Verify:

- **Framework Preset**: `Vite`
- **Root Directory**: Leave as `./` *(vercel.json handles the path)*
- **Build Command**: `cd frontend/web && npm install && npm run build` *(auto-configured)*
- **Output Directory**: `frontend/web/dist` *(auto-configured)*
- **Install Command**: `cd frontend/web && npm install` *(auto-configured)*

### Step 3: Add Environment Variables
Click **"Environment Variables"** and add:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | Your Render backend URL | `https://restaurantbot-backend.onrender.com` |
| `VITE_APP_NAME` | `RestaurantBot AI` | Static value |

> **Note**: Vite uses `VITE_` prefix for environment variables accessible in the browser.

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Once deployed, you'll get a URL like: `https://resto-restaurant.vercel.app`

### Step 5: Test Frontend
1. Visit your Vercel URL
2. Check that the app loads correctly
3. Test API connectivity (try placing an order or viewing menu)

✅ **Frontend deployed!**

---

## 4️⃣ Post-Deployment Configuration

### Update CORS Settings
If you get CORS errors, update your backend `server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

### Set Custom Domain (Optional)
**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**Render:**
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 🎯 Summary of Deployment Stack

| Component | Platform | URL | Free Tier Limits |
|-----------|----------|-----|------------------|
| **Database** | Supabase | Dashboard only | 500MB storage, 2GB bandwidth |
| **Backend API** | Render | `https://xxx.onrender.com` | 750 hours/month, sleeps after 15min idle |
| **Frontend** | Vercel | `https://xxx.vercel.app` | 100GB bandwidth, unlimited deployments |

---

## 🔧 Troubleshooting

### Backend Issues

**Build fails with "Cannot find package.json"**
- ✅ Fixed by `render.yaml` setting `rootDir: backend`
- Verify the file exists at repository root

**"vite: command not found" on Render**
- This is normal - Render is for backend only
- Frontend should be on Vercel

**Service won't start**
- Check environment variables are set correctly
- View logs in Render dashboard
- Ensure `PORT` is set to `10000`

### Frontend Issues

**Build fails with "Cannot find module"**
- ✅ Fixed by `vercel.json` build command
- Verify `frontend/web/package.json` exists

**API calls failing (CORS errors)**
- Add your Vercel URL to backend CORS whitelist
- Ensure `VITE_API_URL` points to correct Render URL

**Blank page after deployment**
- Check browser console for errors
- Verify environment variables are set
- Check that `vercel.json` rewrites are configured

### Database Issues

**Connection refused**
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Check Supabase project is active (not paused)

---

## 🚀 Next Steps

1. **Monitor Performance**: Check Render and Vercel dashboards for metrics
2. **Set Up Analytics**: Add Google Analytics or similar
3. **Enable Monitoring**: Set up error tracking (Sentry, LogRocket)
4. **Optimize**: Enable caching, CDN, image optimization
5. **Scale**: Upgrade to paid plans when needed

---

## 💡 Development Workflow

### Local Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend/web
npm install
npm run dev
```

### Deployment
```bash
# Commit and push changes
git add .
git commit -m "Your changes"
git push origin main

# Automatic deployment triggers on both platforms!
```

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: Check your GitHub repository issues

---

### 🎉 Congratulations!
Your RestaurantBot AI is now live and accessible worldwide on free hosting!
