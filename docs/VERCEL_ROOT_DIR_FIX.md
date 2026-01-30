# Vercel Root Directory Configuration Fix

## 🔧 Issue Identified

You set **Root Directory** to `frontend/web` in the Vercel dashboard, which is correct! However, this conflicts with the `vercel.json` build commands that include `cd frontend/web`.

When you set a root directory in Vercel:
- Vercel **starts** in that directory
- Build commands run **from** that directory
- You don't need `cd frontend/web` anymore

## ✅ Fix Applied

I've updated `vercel.json` to remove the `cd frontend/web` commands:

**Old (incorrect with root directory set):**
```json
{
  "buildCommand": "cd frontend/web && npm install && npm run build",
  "outputDirectory": "frontend/web/dist"
}
```

**New (correct with root directory = frontend/web):**
```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist"
}
```

## 🚀 Next Steps

### Option 1: Keep Root Directory Setting (Recommended)

1. **Push the updated vercel.json:**
   ```bash
   git add vercel.json
   git commit -m "Fix vercel.json for root directory configuration"
   git push origin main
   ```

2. **Redeploy in Vercel:**
   - Go to Deployments tab
   - Click **Redeploy** on the latest deployment
   - Build should succeed now!

### Option 2: Remove Root Directory Setting

If you prefer to use the original `vercel.json`:

1. **In Vercel Dashboard:**
   - Go to Settings → General
   - Find **Root Directory**
   - Clear it (set back to `./`)
   - Save changes

2. **Revert vercel.json** (I can do this if you want)

3. **Redeploy**

---

## 📋 Current Configuration Summary

With the fix applied, your Vercel setup is:

| Setting | Value | Location |
|---------|-------|----------|
| **Root Directory** | `frontend/web` | Dashboard |
| **Build Command** | `npm install && npm run build` | vercel.json |
| **Output Directory** | `dist` | vercel.json |
| **Install Command** | `npm install` | vercel.json |
| **Framework** | `Vite` | Auto-detected |

## ✅ Environment Variables

You already set these correctly:
- ✅ `VITE_API_URL` = `https://resto-restaurant-website-mvp.onrender.com`
- ✅ `VITE_APP_NAME` = `RestaurantBot AI`

## 🎯 Expected Result

After pushing the updated `vercel.json` and redeploying:

1. ✅ Build will start in `frontend/web` directory
2. ✅ Dependencies install correctly
3. ✅ Vite builds the app
4. ✅ Output goes to `dist/` (relative to `frontend/web`)
5. ✅ Deployment succeeds!

---

## 🔍 Verification

Successful build logs should show:

```
Running "vercel build"
Vercel CLI 50.5.2

> Build Command: npm install && npm run build

Installing dependencies...
added 245 packages

Building application...
vite v4.3.9 building for production...
✓ built in 12s

Build Completed
```

No more "command not found" or path errors!
