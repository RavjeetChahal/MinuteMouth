# MinuteMouth Setup Guide

Complete setup instructions for MinuteMouth development and deployment.

## Prerequisites

### Required
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js)
- **Expo CLI**: Installed globally or via npx
- **Supabase Account**: Free tier works great

### Optional
- **Watchman**: For better file watching (macOS/Linux)
- **iOS Simulator**: For iOS development (macOS only)
- **Android Studio**: For Android development
- **Git**: For version control

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd MinuteMouth

# Install dependencies
npm install
```

This will install all required packages including:
- React Native & Expo
- Supabase client
- NativeWind (Tailwind CSS)
- Reanimated & Gesture Handler
- TypeScript & types

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name**: MinuteMouth (or your choice)
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest to your users
5. Wait for project to finish setting up (~2 minutes)

### 2.2 Get Credentials

1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2.3 Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. Verify tables created: Go to **Database** → **Tables**
   - You should see: `users`, `posts`, `prompts`, `daily_prompt`, `awards_weekly`

### 2.4 Verify Row Level Security

1. Go to **Authentication** → **Policies**
2. Check that each table has RLS enabled and policies created
3. If not, the schema.sql should have created them

## Step 3: Environment Variables

### 3.1 Create .env File

```bash
cp .env.example .env
```

Or create `.env` manually:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Add Your Credentials

Replace the placeholder values with your actual Supabase credentials from Step 2.2.

**Important**: 
- Never commit `.env` to git
- `.gitignore` already includes `.env`
- For deployment, set these in your hosting platform's environment variables

## Step 4: Seed Database

### 4.1 Seed Prompts

```bash
# This will add 300+ prompts to your database
npm run seed:prompts
```

If this script doesn't exist yet, create `scripts/seed-prompts.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function seedPrompts() {
  // Import prompts from constants
  const { PROMPTS } = require('../constants/prompts');
  
  console.log(`Seeding ${PROMPTS.length} prompts...`);
  
  const { data, error } = await supabase
    .from('prompts')
    .insert(PROMPTS);
  
  if (error) {
    console.error('Error seeding prompts:', error);
    process.exit(1);
  }
  
  console.log('✅ Prompts seeded successfully!');
}

seedPrompts();
```

### 4.2 Verify Seed

1. Go to Supabase Dashboard
2. **Database** → **Tables** → `prompts`
3. Should see ~300 rows

## Step 5: Development Setup

### 5.1 Increase File Limits (macOS/Linux)

If you encounter "too many open files" errors:

```bash
# Check current limit
ulimit -n

# Increase limit (temporary)
ulimit -n 4096

# Make permanent (add to ~/.zshrc or ~/.bashrc)
echo "ulimit -n 4096" >> ~/.zshrc
source ~/.zshrc
```

See `FIX_EMFILE.md` for more details.

### 5.2 Install Watchman (Optional, macOS)

```bash
# Via Homebrew
brew install watchman
```

This improves file watching performance.

## Step 6: Start Development

### 6.1 Start Expo

```bash
npm start
```

Or with cache clearing:

```bash
npm run start:clear
```

### 6.2 Choose Platform

After Metro bundler starts:
- Press **`w`** for web (recommended for testing)
- Press **`i`** for iOS simulator (macOS only)
- Press **`a`** for Android emulator
- Scan QR code with Expo Go app for physical device

### 6.3 Web Development

```bash
npm run web
```

Opens browser at `http://localhost:8081`

## Step 7: Verify Setup

### 7.1 Test Device Identity

1. Open the app
2. Check browser console (web) or logs (native)
3. Should see: "Device UUID: xxxx-xxxx-xxxx-xxxx"
4. Verify UUID persists on reload

### 7.2 Test Database Connection

1. Navigate to "Today's Prompt"
2. Should see a random prompt loaded from database
3. Check Supabase Dashboard → Database → daily_prompt table

### 7.3 Test Posting

1. Tap "Post Something" or "Today's Prompt"
2. Select a category
3. Write a post
4. Submit
5. Check Supabase Dashboard → posts table

### 7.4 Test Feed

1. Go to main feed
2. Should see posts (if any exist)
3. Test swiping left/right
4. Test giving flames
5. Verify realtime updates

## Common Issues

### Issue: "Too many open files"

**Solution**: Increase ulimit (see Step 5.1) and ensure `.watchmanconfig` exists

### Issue: "Cannot connect to Supabase"

**Solution**: 
- Verify `.env` file exists and has correct credentials
- Restart Metro bundler
- Check internet connection
- Verify Supabase project is active

### Issue: "Module not found"

**Solution**:
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### Issue: Web bundle fails

**Solution**:
```bash
# Clear all caches
rm -rf .expo node_modules/.cache
npm install
npm start -- --clear
```

See `WEB_DEBUG.md` for more web-specific issues.

### Issue: TypeScript errors

**Solution**:
```bash
# Type check
npx tsc --noEmit

# If types are missing
npm install --save-dev @types/react @types/react-native
```

### Issue: NativeWind not working

**Solution**:
- Verify `tailwind.config.js` has `presets: [require("nativewind/preset")]`
- Check `metro.config.js` has `withNativeWind(config, { input: './global.css' })`
- Restart Metro with `--clear` flag

## Next Steps

After setup is complete:

1. **Read Documentation**:
   - `README.md` - Project overview
   - `DEPLOYMENT.md` - Deployment instructions
   - `AWARDS_SETUP.md` - Weekly awards automation

2. **Explore Code**:
   - `app/` - All screens
   - `lib/` - Core logic
   - `constants/` - Design system

3. **Customize**:
   - Update colors in `constants/theme.ts`
   - Add more prompts to `constants/prompts.ts`
   - Modify categories in `constants/categories.ts`

4. **Deploy**:
   - Follow `DEPLOYMENT.md` for web/mobile deployment
   - Set up weekly awards automation (see `AWARDS_SETUP.md`)

## Development Tips

### Hot Reload
- Changes auto-reload on save
- If stuck, press `r` in Metro bundler to reload manually

### Debugging
- Web: Use Chrome DevTools
- iOS: Use Safari Developer Tools
- Android: Use Chrome's `chrome://inspect`
- React Native Debugger (standalone app)

### Code Quality
```bash
# Type checking
npx tsc --noEmit

# Linting (if configured)
npm run lint

# Format (if configured)
npm run format
```

### Testing Realtime
1. Open app in two browsers/devices
2. Post from one
3. Should appear in other instantly

### Database Inspection
- Use Supabase Dashboard for easy viewing
- Or connect with any PostgreSQL client

## Environment-Specific Setup

### Production
- Set environment variables in hosting platform
- Enable Supabase production mode
- Set up monitoring/logging
- Configure error tracking (e.g., Sentry)

### Staging
- Create separate Supabase project for staging
- Use staging `.env` file
- Test deployments here first

### Local Development
- Use free Supabase tier
- Test locally before pushing
- Use Expo Go for quick testing

## Support

If you encounter issues:
1. Check this guide
2. See `FIX_EMFILE.md` for file limit issues
3. See `WEB_DEBUG.md` for web issues
4. Check Supabase logs in Dashboard
5. Review Metro bundler output
6. Open an issue on GitHub

---

**Ready to go?** Run `npm start` and start building! 🔥
