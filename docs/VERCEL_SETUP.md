# Vercel Deployment Guide - Detailed Setup

## 🎯 Current Status
- ✅ **Render Backend**: Live and running
- 🔄 **Vercel Frontend**: Configuring...

---

## Step-by-Step Vercel Configuration

### 1. Access Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project: `resto-restaurant-website-mvp-3809767135820761914`
3. Click on the project name

### 2. Configure Build Settings

The `vercel.json` file should auto-configure everything, but let's verify:

#### Go to Project Settings
1. Click **Settings** tab
2. Navigate to **General** section

#### Verify Build & Development Settings
Click **Build & Development Settings** and ensure:

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | `Vite` | Auto-detected |
| **Root Directory** | `./` | Leave as default |
| **Build Command** | `cd frontend/web && npm install && npm run build` | From vercel.json |
| **Output Directory** | `frontend/web/dist` | From vercel.json |
| **Install Command** | `cd frontend/web && npm install` | From vercel.json |

> **Important**: If these are empty or different, the `vercel.json` might not be detected. You can manually enter them.

### 3. Add Environment Variables

This is **CRITICAL** - your frontend needs to know where the backend is!

#### Navigate to Environment Variables
1. In Settings, click **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_API_URL` | `https://your-render-backend.onrender.com` | Production, Preview, Development |
| `VITE_APP_NAME` | `RestaurantBot AI` | Production, Preview, Development |

**Replace** `https://your-render-backend.onrender.com` with your **actual Render URL**!

#### How to Add:
1. Click **Add New**
2. Enter **Key**: `VITE_API_URL`
3. Enter **Value**: Your Render backend URL (e.g., `https://restaurantbot-backend.onrender.com`)
4. Select all environments: **Production**, **Preview**, **Development**
5. Click **Save**
6. Repeat for `VITE_APP_NAME`

### 4. Trigger Deployment

After adding environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** menu (⋯)
4. Click **Redeploy**
5. Check **Use existing Build Cache** (optional, faster)
6. Click **Redeploy**

---

## 🔍 Monitoring the Build

### Watch Build Logs
1. Click on the deployment that's running
2. You'll see real-time logs
3. Look for these success indicators:

```
✓ Building...
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### Common Build Errors & Fixes

#### Error: "vite: command not found"
**Cause**: Build command not navigating to `frontend/web/`

**Fix**:
1. Go to Settings → Build & Development Settings
2. Set **Build Command** to: `cd frontend/web && npm install && npm run build`
3. Set **Install Command** to: `cd frontend/web && npm install`
4. Redeploy

#### Error: "Cannot find module 'react'"
**Cause**: Dependencies not installed from correct directory

**Fix**:
1. Verify **Install Command** includes `cd frontend/web`
2. Check that `frontend/web/package.json` exists in your repo
3. Redeploy

#### Error: "Failed to compile"
**Cause**: Code errors or missing environment variables

**Fix**:
1. Check build logs for specific error
2. Verify all `VITE_*` environment variables are set
3. Test build locally: `cd frontend/web && npm run build`

#### Build succeeds but page is blank
**Cause**: Missing SPA routing configuration

**Fix**:
1. Verify `vercel.json` has rewrites section:
   ```json
   "rewrites": [
     { "source": "/(.*)", "destination": "/index.html" }
   ]
   ```
2. Redeploy

---

## 🧪 Testing Your Deployment

### 1. Check Deployment URL
After successful build, Vercel gives you a URL like:
- **Production**: `https://resto-restaurant-mvp.vercel.app`
- **Preview**: `https://resto-restaurant-mvp-git-main-username.vercel.app`

### 2. Test Frontend Functionality

Visit your Vercel URL and test:

✅ **Page loads** - No blank screen  
✅ **Menu displays** - Items load from backend  
✅ **API connectivity** - Check browser console for errors  
✅ **Navigation works** - All routes accessible  
✅ **Ordering works** - Can add items to cart  

### 3. Check Browser Console

Press `F12` to open DevTools:

**Good signs:**
- No red errors
- API calls to your Render backend succeed (200 status)

**Bad signs:**
- CORS errors → Need to update backend CORS settings
- 404 on API calls → Wrong `VITE_API_URL`
- Network errors → Backend might be sleeping (Render free tier)

---

## 🔧 Troubleshooting API Connection

### CORS Errors

If you see: `Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Fix in Backend** (`backend/server.js`):

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'https://your-vercel-app-git-main-username.vercel.app', // Preview deployments
    'http://localhost:5173' // Local development
  ],
  credentials: true
}));
```

**Steps:**
1. Update `backend/server.js` with your Vercel URLs
2. Commit and push to GitHub
3. Render will auto-deploy the backend update
4. Test again

### Backend Sleeping (Render Free Tier)

Render free tier spins down after 15 minutes of inactivity.

**Symptoms:**
- First API call takes 30-60 seconds
- Subsequent calls are fast

**Solutions:**
1. **Accept it** - It's a free tier limitation
2. **Add loading state** - Show "Waking up server..." message
3. **Upgrade to paid plan** - $7/month keeps it always on
4. **Use a ping service** - Keep backend awake (against Render TOS)

---

## 📱 Custom Domain (Optional)

### Add Your Own Domain

1. Go to Project Settings → **Domains**
2. Click **Add**
3. Enter your domain (e.g., `restaurantbot.com`)
4. Follow DNS configuration instructions:
   - **A Record**: Point to Vercel's IP
   - **CNAME**: Point to `cname.vercel-dns.com`
5. Wait for DNS propagation (5-60 minutes)
6. SSL certificate auto-generated

---

## ✅ Verification Checklist

Before considering deployment complete:

- [ ] Build completes successfully (green checkmark)
- [ ] Deployment URL is accessible
- [ ] Homepage loads without errors
- [ ] Menu items display correctly
- [ ] API calls to backend succeed
- [ ] No CORS errors in console
- [ ] Navigation between pages works
- [ ] Order placement works
- [ ] Environment variables are set correctly
- [ ] Custom domain configured (if applicable)

---

## 🚀 Post-Deployment

### Automatic Deployments

Every time you push to GitHub:
- **Vercel** auto-deploys frontend
- **Render** auto-deploys backend

### Preview Deployments

Vercel creates preview deployments for:
- Pull requests
- Non-main branches

Each gets a unique URL for testing.

### Monitoring

**Vercel Analytics** (Free):
1. Go to project → **Analytics**
2. See visitor stats, performance metrics
3. Enable Web Vitals tracking

**Render Logs**:
1. Go to service → **Logs**
2. Monitor backend errors
3. Check API request logs

---

## 🆘 Still Having Issues?

### Check These Files

1. **vercel.json** - Verify it's in repository root
   ```bash
   git ls-files | grep vercel.json
   ```

2. **frontend/web/package.json** - Verify it exists
   ```bash
   ls frontend/web/package.json
   ```

3. **Build logs** - Look for specific error messages

### Get Help

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Build logs**: Share specific error messages

---

## 📊 Expected Build Output

Successful Vercel build should look like:

```
Running "vercel build"
Vercel CLI 50.5.2

> Build Command: cd frontend/web && npm install && npm run build

Installing dependencies...
added 245 packages in 15s

Building application...
vite v4.3.9 building for production...
✓ 1234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.css      12.34 kB
dist/assets/index-def456.js       145.67 kB

✓ built in 12.34s

Build Completed
Output Directory: frontend/web/dist
```

---

## 🎉 Success!

Once you see:
- ✅ **Build Status**: Ready
- ✅ **Deployment**: Active
- ✅ **URL**: Accessible

Your restaurant AI app is **LIVE** on the internet! 🚀

Visit your Vercel URL and start taking orders!
