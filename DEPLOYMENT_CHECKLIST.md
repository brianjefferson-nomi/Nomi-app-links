# Vercel Deployment Checklist

## ⚠️ Critical: Still Getting 404?

If you're still getting 404 errors after following the setup, check these steps:

## Step 1: Verify Files Are Committed

The files MUST be committed to your GitHub repository for Vercel to deploy them:

```bash
cd vercel-link-server

# Check git status
git status

# If files are untracked/modified:
git add .
git commit -m "Add Next.js App Router structure for deep links"
git push
```

## Step 2: Check Vercel Deployment

1. Go to Vercel Dashboard
2. Click on your project (`nomi-links` or `nomi-app-links`)
3. Go to "Deployments" tab
4. Check the **latest deployment status**:
   - ✅ **Ready** = Success
   - ❌ **Error** = Check build logs
   - ⏳ **Building** = Wait for completion

## Step 3: Check Build Logs

If deployment shows "Error":

1. Click on the failed deployment
2. Click "Build Logs"
3. Look for:
   - `Error: Cannot find module` → Missing dependencies
   - `Error: Unexpected token` → Syntax error
   - `Error: app/layout.js not found` → Missing file

## Step 4: Verify Required Files Exist

All these files MUST be in your GitHub repository:

```
vercel-link-server/
├── app/
│   ├── layout.js          ← REQUIRED
│   └── [...slug]/
│       └── page.js        ← REQUIRED
├── public/
│   └── .well-known/
│       ├── apple-app-site-association
│       └── assetlinks.json
├── package.json           ← REQUIRED
├── next.config.js         ← REQUIRED
└── vercel.json           ← REQUIRED
```

**Check on GitHub:**
1. Go to your repository
2. Navigate to `vercel-link-server/` folder
3. Verify all files exist

## Step 5: Remove Conflicting `pages/` Directory

If you have a `pages/` directory, it might conflict:

```bash
cd vercel-link-server

# Check if pages exists
ls -la pages/

# If it exists and has files, either:
# Option 1: Delete it (if empty or not needed)
rm -rf pages/

# Option 2: Or ensure app/ takes precedence
# (app/ should work, but pages/ can cause issues)
```

## Step 6: Verify Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` is set
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

**If missing:**
1. Add them
2. Redeploy (or wait for next deployment)

## Step 7: Force Redeploy

If everything looks correct but still 404:

1. In Vercel Dashboard > Deployments
2. Click "..." menu on latest deployment
3. Click "Redeploy"

Or trigger a new deployment:

```bash
# Make a small change and push
cd vercel-link-server
echo "# Deployment trigger" >> README.md
git add README.md
git commit -m "Trigger redeploy"
git push
```

## Step 8: Test Local Build

Test if the code works locally:

```bash
cd vercel-link-server

# Install dependencies
npm install

# Test build
npm run build

# If build succeeds, code is correct
# If build fails, fix errors shown
```

**If local build fails:**
- Fix the errors shown
- Commit and push
- Vercel will redeploy automatically

## Common Deployment Issues

### Issue: "Build failed" or "Deployment error"

**Solution:**
1. Check build logs in Vercel
2. Fix errors shown
3. Commit and push
4. Redeploy

### Issue: Files exist locally but not on Vercel

**Solution:**
1. Verify files are committed: `git status`
2. Verify files are pushed: `git push`
3. Check GitHub repository has the files
4. Trigger manual redeploy in Vercel

### Issue: 404 persists after successful deployment

**Solution:**
1. Wait 1-2 minutes (Vercel CDN propagation)
2. Clear browser cache
3. Test with fresh URL: `curl https://nomi-app-links.vercel.app/restaurant/test123`
4. Check Vercel function logs for runtime errors

## Quick Debug Command

Test if the deployment is working:

```bash
# Should return HTML (not 404)
curl -I https://nomi-app-links.vercel.app/restaurant/test123

# Should show status: 200 OK (not 404)
```

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Dashboard > Your Project > Functions
   - Look for runtime errors

2. **Verify Project Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (or auto-detected)
   - Output Directory: `.next` (or auto-detected)

3. **Contact Support:**
   - Share Vercel build logs
   - Share repository structure
   - Share test URL that's failing

