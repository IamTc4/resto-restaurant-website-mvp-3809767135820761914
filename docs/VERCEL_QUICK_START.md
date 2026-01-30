# Vercel Quick Setup Checklist

## ✅ What You Need to Do Right Now

### 1. Get Your Render Backend URL
First, find your live Render backend URL:
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click on your backend service
3. Copy the URL at the top (e.g., `https://restaurantbot-backend.onrender.com`)

### 2. Add Environment Variables in Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

**Variable 1:**
- **Key**: `VITE_API_URL`
- **Value**: `https://your-render-backend.onrender.com` (paste your actual Render URL)
- **Environments**: Check all three (Production, Preview, Development)
- Click **Save**

**Variable 2:**
- **Key**: `VITE_APP_NAME`
- **Value**: `RestaurantBot AI`
- **Environments**: Check all three
- Click **Save**

### 3. Redeploy
1. Go to **Deployments** tab
2. Find the current/latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Click **Redeploy** again to confirm

### 4. Wait for Build
- Build takes 2-3 minutes
- Watch the logs for any errors
- Look for "Build Completed" message

### 5. Test Your App
Once deployed:
1. Click on the deployment URL (e.g., `https://your-app.vercel.app`)
2. Check if the app loads
3. Test menu display
4. Try placing an order
5. Open browser console (F12) - should have no red errors

---

## 🔍 If Build Fails

### Check Build Settings
Go to **Settings** → **Build & Development Settings**

Make sure these are set:
- **Build Command**: `cd frontend/web && npm install && npm run build`
- **Output Directory**: `frontend/web/dist`
- **Install Command**: `cd frontend/web && npm install`

If they're empty, fill them in and redeploy.

---

## 🆘 Common Issues

### "vite: command not found"
- Build command is wrong
- Fix: Update build command to include `cd frontend/web`

### Blank page after deployment
- Missing environment variables
- Fix: Add `VITE_API_URL` with your Render backend URL

### CORS errors in browser console
- Backend doesn't allow your Vercel domain
- Fix: Update `backend/server.js` CORS settings (see VERCEL_SETUP.md)

---

## 📞 Need More Help?
See the detailed guide: [VERCEL_SETUP.md](file:///c:/work/resto-restaurant-website-mvp-3809767135820761914/docs/VERCEL_SETUP.md)
