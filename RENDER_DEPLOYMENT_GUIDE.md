# Deploy to Render - Complete Guide

## Overview
This guide walks you through deploying your Kibagabaga Twin-Block Apartments booking page to Render using your GitHub repository.

---

## Step-by-Step Deployment

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com)
2. Click **"Sign Up"** (or sign in if you already have an account)
3. Choose **"Sign up with GitHub"** for easier connection
4. Authorize Render to access your GitHub account

### Step 2: Create a Static Site on Render
1. In your Render dashboard, click **"+ New +"** button
2. Select **"Static Site"** from the dropdown
3. You'll see a list of your GitHub repositories

### Step 3: Connect Your Repository
1. Find and select: **`kibagabaga-twin-block-appartmen`**
2. Click **"Connect"**
3. Render will ask for authorization - click **"Authorize"**

### Step 4: Configure Build Settings
Fill in the deployment settings with these values:

| Field | Value |
|-------|-------|
| **Name** | `kibagabaga-booking` (or your preferred name) |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Branch** | `main` |

### Step 5: Deploy
1. Click **"Create Static Site"**
2. Render will automatically start building your project
3. You'll see build logs in real-time
4. Once complete, you'll get a live URL like: `https://kibagabaga-booking.onrender.com`

---

## What Happens During Build

1. **Install Dependencies** - Installs all npm packages
2. **Build** - Runs `tsc -b && vite build` to create optimized production files
3. **Generate dist/** - Creates the `dist` folder with all static files
4. **Deploy** - Uploads `dist` files to Render's CDN

---

## After Deployment

### Access Your Site
- Your live URL: `https://[your-site-name].onrender.com`
- Admin Dashboard: `https://[your-site-name].onrender.com/#admin`
- Admin Password: `kibagabaga`

### Custom Domain (Optional)
1. In Render dashboard, go to your site settings
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `kibagabaga-apartments.com`)
4. Follow DNS setup instructions

### Environment Variables (If Needed)
If you add any API keys or secrets later:
1. Go to **Site Settings** → **Environment**
2. Add your variables
3. Re-deploy to apply changes

---

## Troubleshooting

### Build Fails
- Check that all dependencies in `package.json` are available
- Ensure `dist` is the correct publish directory
- Check build logs for specific errors

### Site Shows 404
- Make sure publish directory is set to `dist`
- Verify the build completed successfully
- Check that `index.html` exists in the dist folder

### Routes Not Working (Admin Dashboard)
- The app uses hash-based routing (`/#admin`)
- This is already configured and should work automatically
- Test: `https://your-site.onrender.com/#admin`

### Redeploying After Changes
- Push changes to GitHub
- Render will auto-detect and rebuild
- Or manually trigger: **Dashboard** → **Deploys** → **"Trigger Deploy"**

---

## Performance Tips

1. **Build times** - First build takes 3-5 minutes, subsequent builds are faster
2. **Site goes to sleep** - Free tier sites sleep after 15 minutes of inactivity
3. **Upgrade for production** - Consider a paid plan for always-on hosting

---

## Monitoring Your Deployment

1. **Logs** - View real-time logs in the **"Logs"** tab
2. **Metrics** - Check CPU, memory, and bandwidth in **"Metrics"**
3. **Deploys** - View deployment history in **"Deploys"** tab

---

## Quick Reference

```bash
# Local testing before deployment
npm run build    # Creates dist/ folder
npm run preview  # Preview production build locally

# Push to trigger auto-deploy
git push origin main
```

---

## Support
- Render Docs: https://render.com/docs
- React/Vite Issues: Check build logs for specific errors
- GitHub Integration Help: https://render.com/docs/github

---

**Your site will be live within minutes! 🚀**
