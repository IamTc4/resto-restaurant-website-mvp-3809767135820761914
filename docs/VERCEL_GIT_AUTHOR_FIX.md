# Vercel Git Author Mismatch Fix

## 🚨 The Problem

Vercel CLI is reading your Git config and seeing:
- **Git author**: `23f2005433@ds.study.iitm.ac.in`
- **Vercel team**: `devbee`

This email doesn't have access to the `devbee` team, so deployment fails.

---

## ✅ Solution 1: Add Email to Vercel Team (Recommended)

### Option A: Invite the Email to Your Team

1. Go to [Vercel Team Settings](https://vercel.com/teams/devbee/settings/members)
2. Click **Invite Member**
3. Enter: `23f2005433@ds.study.iitm.ac.in`
4. Send invitation
5. Accept the invitation
6. Run `vercel --prod` again

### Option B: Change Git Config for This Project

Set the correct email for this repository only:

```bash
cd C:\work\resto-restaurant-website-mvp-3809767135820761914

# Set your GitHub email for this project
git config user.email "your-github-email@example.com"
git config user.name "Your Name"

# Verify
git config user.email
```

Then run `vercel --prod` again.

---

## ✅ Solution 2: Deploy Without Git Integration

Use `--force` flag to bypass Git checks:

```bash
cd C:\work\resto-restaurant-website-mvp-3809767135820761914

vercel --prod --force
```

This deploys directly without checking Git author.

---

## ✅ Solution 3: Use Personal Account Instead of Team

Unlink from team and deploy to personal account:

```bash
cd C:\work\resto-restaurant-website-mvp-3809767135820761914\frontend\web

# Remove .vercel directory
rm -r .vercel

# Re-run vercel
vercel --prod
```

When prompted:
- Choose **your personal account** instead of `devbee` team
- This will create a new project under your personal account

---

## 🎯 Recommended Quick Fix

**Try this first** (deploy without Git checks):

```bash
cd C:\work\resto-restaurant-website-mvp-3809767135820761914
vercel --prod --force
```

If that doesn't work, **change Git config**:

```bash
# Check current email
git config user.email

# Change to your GitHub email
git config user.email "sharvilmore445@gmail.com"  # or whatever your GitHub email is

# Try again
vercel --prod
```

---

## 📋 Check Your Git Config

```bash
# See current config
git config --list | grep user

# Global config
git config --global user.email
git config --global user.name

# Local (this repo) config
git config user.email
git config user.name
```

---

## 🆘 Alternative: Just Use Dashboard Deployment

If CLI continues to have issues, the dashboard deployment works fine once you fix the root directory setting:

1. Go to: https://vercel.com/skinterior/resto-restaurant-website-mvp-3809767135820761914/settings
2. Clear **Root Directory** (set to empty or `./`)
3. Save
4. Go to **Deployments** → **Redeploy**

The dashboard doesn't care about Git author - it just deploys from GitHub!
