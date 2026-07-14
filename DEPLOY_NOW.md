# Deployment Guide - Choose Your Platform

## Issue Fixed
The npm hanging error was caused by:
- Missing npm configuration for Render environment
- Insufficient memory allocation
- Network timeout issues
- Slow dependency installation

## Solution Applied
- Added `.npmrc` with extended timeouts
- Optimized build command with `npm ci --prefer-offline`
- Added `NODE_OPTIONS` for memory allocation
- Created `vercel.json` as alternative

---

## Option 1: Deploy to Vercel (RECOMMENDED ✅)

### Step 1: Import Project
1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Search for `kibagabaga-twin-block-appartmen`
4. Click "Import"

### Step 2: Configure Project
- Framework: **Other** (or Auto-detected)
- Root Directory: **.** (default)
- Build Command: `npm run build`
- Output Directory: `dist`

### Step 3: Deploy
Click "Deploy" - Done! Vercel will automatically:
- Detect `vercel.json` configuration
- Build with optimized settings
- Deploy to a live URL in 1-2 minutes
- Provide automatic HTTPS

**Your site will be live at:** `https://your-project-name.vercel.app`

**Pros:**
- ✅ Optimized for React/Vite
- ✅ Automatic HTTPS
- ✅ Free tier
- ✅ Fast deployments
- ✅ Better hash routing support
- ✅ 1-2 minute deployment time

---

## Option 2: Deploy to Render (ALTERNATIVE)

### Step 1: Create Blueprint
1. Go to https://render.com/
2. Click "Dashboard" (sign in with GitHub)
3. Click "New +" → "Blueprint"
4. Select `kibagabaga-twin-block-appartmen`

### Step 2: Auto-Configure
- Render will automatically detect `render.yaml`
- All settings pre-configured

### Step 3: Deploy
Click "Create" - Render will:
- Use optimized npm settings
- Allocate 4GB memory
- Build in ~5-10 minutes
- Deploy to live URL

**Your site will be live at:** `https://your-project.onrender.com`

**Pros:**
- ✅ Free tier available
- ✅ Simple setup
- ✅ Uses render.yaml config

**Note:** First deploy takes 5-10 minutes, but subsequent deployments are faster.

---

## Quick Comparison

| Feature | Vercel | Render |
|---------|--------|--------|
| Deployment Time | 1-2 min | 5-10 min |
| Free Tier | ✅ Yes | ✅ Yes |
| HTTPS | ✅ Auto | ✅ Auto |
| Build Optimization | ✅ Best | ✅ Good |
| Hash Routing | ✅ Perfect | ✅ Good |
| Admin Dashboard | ✅ Works | ✅ Works |

---

## After Deployment

### Access Your Site
- **Main Site:** `https://your-domain.com`
- **Admin Dashboard:** `https://your-domain.com/#admin`
- **Admin Password:** `kibagabaga`

### Test Admin Access
1. Visit `https://your-domain.com/#admin`
2. Enter password: `kibagabaga`
3. Click "Enter Dashboard"
4. You should see the booking list and management options

### Subsequent Updates
Just push to GitHub:
```bash
git push origin main
```

Both Vercel and Render will automatically redeploy within seconds.

---

## Troubleshooting

### Still seeing npm error?
**Solution:** Try Vercel instead - it has better npm/Node integration.

### Admin password not working?
**Solution:** Clear browser cache and try again.

### Hash routing not working?
**Solution:** Vercel and Render both have proper configs for this. If still broken, verify you're accessing `/#admin` (with hash symbol).

### Site is blank?
**Solution:** 
1. Check browser console for errors (F12)
2. Clear cache and reload
3. Try deploying again

---

## I Recommend: Deploy to Vercel

Vercel is optimized for React/Vite projects and will give you:
- Fastest deployment (1-2 minutes)
- Best performance
- Zero configuration needed
- Best hash routing support

👉 **Go to https://vercel.com/new and start deploying now!**
