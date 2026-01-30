# Vercel CLI Deployment - Fix Project Settings

## 🎯 Current Issue

The Vercel CLI is linked to your project, but the project settings in the dashboard have:
- **Root Directory**: `frontend/web` (incorrect when deploying from `frontend/web` directory)

When you run `vercel --prod` from `frontend/web`, it tries to find `frontend/web/frontend/web` ❌

## ✅ Solution

### Option 1: Fix Project Settings in Dashboard (Recommended)

1. Go to: https://vercel.com/skinterior/resto-restaurant-website-mvp-3809767135820761914/settings
2. Find **Root Directory** setting
3. **Clear it** (set to `./` or leave empty)
4. Save changes
5. Run `vercel --prod` again from `frontend/web` directory

### Option 2: Deploy from Repository Root

Instead of deploying from `frontend/web`, deploy from repository root:

```bash
# Go back to repository root
cd C:\work\resto-restaurant-website-mvp-3809767135820761914

# Deploy with Vercel CLI
vercel --prod
```

Vercel will use the root directory setting from the dashboard (`frontend/web`).

### Option 3: Override with CLI Flags

Deploy with explicit configuration:

```bash
# From frontend/web directory
vercel --prod --build-env NODE_VERSION=18
```

Or create `vercel.json` in `frontend/web` directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

## 🚀 Recommended Steps

1. **Clear root directory** in Vercel dashboard settings
2. **Run from `frontend/web`**:
   ```bash
   vercel --prod
   ```
3. CLI will handle the build correctly

## 📋 Expected Success Output

```
Vercel CLI 50.9.5
🔍  Inspect: https://vercel.com/...
✅  Production: https://resto-restaurant-mvp.vercel.app [2m]
```

## ✅ Environment Variables

Good news! CLI already pulled your environment variables to `.env.local`:
- ✅ `VITE_API_URL`
- ✅ `VITE_APP_NAME`

These will be used in the build automatically.
