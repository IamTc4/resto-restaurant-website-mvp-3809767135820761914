# Cloudflare Pages - Deployment Ready

This project is configured for Cloudflare Pages deployment.

## Configuration

All configuration is done via the Cloudflare Pages dashboard:
- **Root Directory**: `frontend/web`
- **Build Command**: `npm run build`
- **Build Output**: `dist`

## Environment Variables

Set these in the Cloudflare Pages dashboard:
- `NODE_VERSION`: `18`
- `VITE_API_URL`: Your Render backend URL
- `VITE_APP_NAME`: `RestaurantBot AI`

## Deployment

Cloudflare Pages automatically deploys on every push to the `main` branch.

No `wrangler.toml` file is needed - all configuration is managed through the dashboard.
