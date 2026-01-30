# ⚠️ CRITICAL: Vercel Configuration Issue

## 🚨 The Real Problem

Vercel has **TWO ways** to configure builds:

1. **Dashboard Settings** (what you set in the UI)
2. **vercel.json file** (in your repository)

**Dashboard settings ALWAYS override vercel.json!**

Since you set **Root Directory = `frontend/web`** in the dashboard, Vercel is **ignoring** the `vercel.json` file completely.

---

## ✅ **SOLUTION: Delete and Recreate Project**

The cleanest fix is to start fresh:

### Step 1: Delete Current Vercel Project

1. Go to Vercel project **Settings**
2. Scroll to bottom → **Delete Project**
3. Type project name to confirm
4. Click **Delete**

### Step 2: Create New Project (Correctly)

1. Click **Add New...** → **Project**
2. Import your GitHub repo
3. **IMPORTANT**: In the configuration screen:
   - **Framework Preset**: Select `Vite`
   - **Root Directory**: **LEAVE EMPTY** (don't set it!)
   - **Build Command**: Leave empty (vercel.json will handle it)
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty

4. **Add Environment Variables**:
   - `VITE_API_URL` = `https://resto-restaurant-website-mvp.onrender.com`
   - `VITE_APP_NAME` = `RestaurantBot AI`

5. Click **Deploy**

### Step 3: Verify

The build should now use `vercel.json` and succeed!

---

## 🎯 **Alternative: Manual Dashboard Override**

If you don't want to delete the project:

### Go to Settings → Build & Development Settings

**Override ALL settings manually:**

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend/web` |
| **Build Command** | `npm install && npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

**Important**: Don't use `cd frontend/web` in commands since root is already set!

Then **Save** and **Redeploy**.

---

## 📊 Why This Keeps Failing

Current issue:
- Root Directory = `frontend/web` (dashboard)
- Install Command = `cd frontend/web && npm install` (from old vercel.json)
- **Result**: Tries to `cd` into `frontend/web/frontend/web` ❌

What should happen:
- Root Directory = `frontend/web` (dashboard)
- Install Command = `npm install` (no cd needed)
- **Result**: Runs in correct directory ✅

---

## 🚀 Recommended Action

**Delete and recreate** the Vercel project. It takes 2 minutes and will work perfectly with `vercel.json`.

Don't set any root directory in the dashboard - let `vercel.json` handle everything!
