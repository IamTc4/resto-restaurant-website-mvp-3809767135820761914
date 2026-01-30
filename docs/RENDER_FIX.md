# Render Manual Configuration Fix

## Problem
Render is still looking for `package.json` in the wrong location even though `render.yaml` exists in the repository. This happens because:

1. **The service was created manually** in the Render dashboard (not via `render.yaml`)
2. **Manual settings override** the `render.yaml` file
3. You need to either **update the manual settings** OR **recreate the service** using the YAML file

---

## Solution 1: Update Existing Service (Recommended)

### Step 1: Go to Render Dashboard
1. Log in to [render.com](https://render.com)
2. Find your service: `restaurantbot-backend` (or whatever you named it)
3. Click on the service name

### Step 2: Update Root Directory
1. Go to **Settings** tab
2. Scroll down to **Build & Deploy** section
3. Find **Root Directory** field
4. Change it from empty (or `./`) to: **`backend`**
5. Click **Save Changes**

### Step 3: Update Build Command (if needed)
While you're in Settings, verify:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Trigger Manual Deploy
1. Go to **Manual Deploy** dropdown (top right)
2. Click **Deploy latest commit**
3. Wait for build to complete

✅ **This should fix the issue immediately!**

---

## Solution 2: Recreate Service Using render.yaml (Alternative)

If Solution 1 doesn't work, you can recreate the service properly:

### Step 1: Delete Existing Service
1. Go to your service settings
2. Scroll to bottom
3. Click **Delete Web Service**
4. Confirm deletion

### Step 2: Create New Service from YAML
1. In Render dashboard, click **New +**
2. Select **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Click **Apply**

### Step 3: Add Environment Variables
Since YAML has `sync: false` for env vars, you need to add them manually:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | Your Supabase URL |
| `SUPABASE_KEY` | Your Supabase anon key |
| `GEMINI_API_KEY` | Your Gemini API key |
| `PORT` | `10000` |

### Step 4: Deploy
Service will auto-deploy after creation.

---

## Solution 3: Alternative render.yaml (If Above Fails)

Some users report that Render's YAML parser can be picky. Try this alternative format:

**Replace your `render.yaml` with:**

```yaml
services:
  - type: web
    name: restaurantbot-backend
    runtime: node
    region: oregon
    plan: free
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /health
```

Changes:
- `env: node` → `runtime: node`
- Removed `envVars` section (add manually in dashboard)

Then:
1. Commit and push this change
2. Delete and recreate the service using Blueprint

---

## Verification

After applying any solution, check:

1. **Build logs should show:**
   ```
   ==> Root Directory: backend
   ==> Running build command 'npm install'...
   ```

2. **No more errors about:**
   ```
   npm error path /opt/render/project/src/package.json
   ```

3. **Service should start successfully**

---

## Why This Happened

When you create a Render service manually (via "New + Web Service"), Render stores those settings in its database. The `render.yaml` file is only used when you:
- Create a service via **Blueprint**
- Use Render's **Infrastructure as Code** feature

Manual dashboard settings **always override** `render.yaml` settings.

---

## Recommended Approach

**Use Solution 1** (Update Root Directory in Settings) - it's the fastest and doesn't require deleting anything.

Only use Solution 2 if you want to manage everything via `render.yaml` going forward.
