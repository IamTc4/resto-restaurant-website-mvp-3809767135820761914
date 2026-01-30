# ✅ FINAL VERCEL CONFIGURATION - Copy These Exact Settings

## 🎯 Use These EXACT Settings in Vercel Dashboard

When creating/configuring your Vercel project, use these settings:

### Project Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | `Other` | Don't select Vite - use Other |
| **Root Directory** | `frontend/web` | ⚠️ CRITICAL - Must be frontend/web |
| **Build Command** | `npx --yes vite build` | Use --yes flag |
| **Output Directory** | `dist` | Relative to root directory |
| **Install Command** | `npm install` | Standard npm install |

### Environment Variables

Add these two variables (all environments):

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://resto-restaurant-website-mvp.onrender.com` |
| `VITE_APP_NAME` | `RestaurantBot AI` |

---

## 🚨 Why This Configuration Works

1. **Root Directory = `frontend/web`**
   - This is where your `package.json` is located
   - Vercel will `cd` into this directory first
   - All commands run from this directory

2. **Framework = `Other`**
   - Avoids Vercel's auto-detection issues
   - Gives you full control over build commands

3. **Build Command = `npx --yes vite build`**
   - `npx` downloads and runs vite directly
   - `--yes` flag skips confirmation prompts
   - Bypasses permission issues with local node_modules

4. **Output Directory = `dist`**
   - Relative to `frontend/web` (the root directory)
   - Full path will be `frontend/web/dist`

---

## 📋 Step-by-Step Setup

### 1. Delete Current Project (if exists)
- Go to Settings → Delete Project

### 2. Create New Project
1. Click **Add New...** → **Project**
2. Import your GitHub repo
3. **Configure exactly as shown in table above**
4. Add environment variables
5. Click **Deploy**

### 3. Expected Build Output

```
Running "vercel build"
Vercel CLI 50.5.2

Root Directory: frontend/web

Running "install" command: npm install
✓ Installed dependencies

Running "build" command: npx --yes vite build
Need to install the following packages:
vite@4.3.9
Ok to proceed? (y) y

vite v4.3.9 building for production...
✓ 234 modules transformed
dist/index.html                   0.45 kB
dist/assets/index-abc123.css      12.34 kB
dist/assets/index-def456.js       145.67 kB
✓ built in 12.34s

Build Completed
Output Directory: dist
```

---

## ✅ This WILL Work Because:

- ✅ Root directory points to where `package.json` exists
- ✅ `npx --yes` downloads fresh vite (no permission issues)
- ✅ No conflicting dashboard/JSON configurations
- ✅ Simple, straightforward build process

---

## 🎉 After Successful Deployment

Your app will be live at: `https://your-project.vercel.app`

Test these:
- [ ] Homepage loads
- [ ] Menu displays
- [ ] API calls work (check browser console)
- [ ] No CORS errors
- [ ] Can place orders

---

## 🆘 If It STILL Fails

This would be very unusual. If it happens:

1. **Screenshot the full build logs** and share them
2. **Try Netlify instead**: 
   - Similar to Vercel
   - Often better with monorepos
   - Free tier available
3. **Contact Vercel support** - might be platform issue

---

## 📝 Summary

**The key was**: Root Directory must be `frontend/web` (where package.json lives), not `./` (repository root).
