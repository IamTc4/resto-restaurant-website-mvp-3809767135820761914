# Vercel Exit Code 126 - Permission Denied Fix

## 🔍 The Problem

Exit code 126 means "Permission denied" - Vercel can't execute the binaries in `node_modules/.bin/`.

This is happening because:
1. Vercel's build environment has strict file permissions
2. The `vite` binary in `node_modules/.bin/` doesn't have execute permissions
3. Even `npx` can't fix it in some cases

## ✅ Solutions Tried

1. ✅ Using `npx vite build` in package.json
2. ✅ Changing vercel.json to use direct `npx vite build`

## 🚀 Current Fix

Updated `vercel.json` to:
```json
{
  "buildCommand": "npx vite build",
  "installCommand": "npm install"
}
```

This bypasses `npm run build` entirely and calls vite directly via npx.

## 🔧 Alternative Solutions

### Option 1: Clear Build Cache in Vercel

Sometimes cached node_modules have wrong permissions:

1. Go to Vercel project → **Settings**
2. Find **Build & Development Settings**
3. Scroll to **Build Cache**
4. Click **Clear Build Cache**
5. Redeploy

### Option 2: Use Different Build Command in Dashboard

Override in Vercel dashboard:

**Build Command**: `npx --yes vite build`

The `--yes` flag forces npx to download a fresh copy.

### Option 3: Add Explicit Permissions Fix

Add to `vercel.json`:
```json
{
  "buildCommand": "chmod +x node_modules/.bin/* && npx vite build"
}
```

### Option 4: Use Vercel's Built-in Vite Support

Don't set any build command - let Vercel auto-detect:

1. Remove `buildCommand` from `vercel.json`
2. Keep only `framework: "vite"`
3. Vercel will use its native Vite builder

## 📊 Recommended Action

Try the current fix first (already pushed). If it still fails:

1. **Clear build cache** in Vercel settings
2. **Redeploy** 
3. If still failing, try **Option 4** (remove buildCommand entirely)

## 🆘 Last Resort

If nothing works, this might be a Vercel platform issue. Try:

1. **Different region**: Change deployment region in settings
2. **Contact Vercel support**: They can check server-side permissions
3. **Use different platform**: Try Netlify or Cloudflare Pages as alternative
