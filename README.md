# Final Say Links - Vercel Deep Linking Server

This is a Next.js project deployed on Vercel that handles deep links and generates dynamic Open Graph (OG) tags for rich social media previews.

## Project Structure

```
vercel-link-server/
├── app/
│   └── [...slug]/
│       └── page.js           # Dynamic route handler with OG tag generation
├── public/
│   └── .well-known/
│       ├── apple-app-site-association  # iOS app verification
│       └── assetlinks.json            # Android app verification
├── vercel.json               # Content-Type fix for iOS
├── package.json
└── README.md
```

## Setup Instructions

### 1. Deploy to Vercel

1. Create a GitHub repository (make it public)
2. Copy all files from this folder to your repository
3. On Vercel dashboard, import your repository
4. Name the project: `nomi-links`
5. Your URL will be: `https://nomi-app-links.vercel.app`

### 2. Configure Environment Variables

In Vercel project settings > Environment Variables, add:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

### 3. Update Android Fingerprint

Edit `public/.well-known/assetlinks.json`:

1. Replace `YOUR_SHA256_FINGERPRINT_HERE` with your actual Android certificate fingerprint
2. Get fingerprint:
   ```bash
   # Debug build
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # Release build
   keytool -list -v -keystore path/to/release.keystore -alias your-key-alias
   ```

### 4. Commit and Deploy

1. Commit all files to GitHub
2. Vercel will automatically deploy
3. Wait for deployment to complete

## Verification

After deployment, verify these URLs are accessible:

- **iOS**: `https://nomi-app-links.vercel.app/.well-known/apple-app-site-association`
- **Android**: `https://nomi-app-links.vercel.app/.well-known/assetlinks.json`
- **Test Restaurant**: `https://nomi-app-links.vercel.app/restaurant/YOUR_RESTAURANT_ID`
- **Test Collection**: `https://nomi-app-links.vercel.app/collection/YOUR_COLLECTION_ID`

You should see:
- JSON text (not 404) for `.well-known` files
- HTML page with OG tags for restaurant/collection links (view page source to see `<meta property="og:...">` tags)

## How It Works

1. User shares: `https://nomi-app-links.vercel.app/restaurant/123`
2. Social media scraper (iMessage, Slack, Twitter) visits the URL
3. Next.js server runs `generateMetadata()` function
4. Fetches restaurant data from Supabase
5. Generates OG tags with restaurant name, description, and image
6. Social media shows rich preview card
7. User clicks link → App opens (via universal links)

## Troubleshooting

### 404 Error

- ✅ Verify `app/[...slug]/page.js` exists (not `pages/[...slug].js`)
- ✅ Check Next.js is using App Router (not Pages Router)
- ✅ Verify deployment completed successfully

### Images Not Showing

- ✅ Check restaurant has image data in Supabase
- ✅ Verify image URLs are publicly accessible (HTTPS)
- ✅ View page source to see if `<meta property="og:image">` exists

### App Not Opening

- ✅ Verify `.well-known` files are accessible (not 404)
- ✅ Check `vercel.json` exists for Content-Type fix
- ✅ Rebuild and reinstall app after adding Associated Domains
- ✅ Test link in Notes/iMessage (not browser address bar)

## Next Steps

See `docs/VERCEL_DEEP_LINKING_SETUP.md` for complete setup guide.

