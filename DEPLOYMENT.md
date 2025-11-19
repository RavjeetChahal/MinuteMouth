# MinuteMouth Deployment Guide

## Prerequisites

- Node.js 18+
- Expo CLI
- Supabase account
- Domain (optional, for custom web deployment)

## Database Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your Project URL and anon key

2. **Run Database Migration:**
   - Open Supabase Dashboard → SQL Editor
   - Copy contents of `database/schema.sql`
   - Execute the SQL

3. **Seed Prompts:**
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_url \
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key \
   node scripts/seed-prompts.js
   ```

## Environment Variables

Create `.env`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Web Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build for web:**
   ```bash
   npx expo export:web
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel Dashboard**

### Option 2: Netlify

1. **Build:**
   ```bash
   npx expo export:web
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod --dir=web-build
   ```

### Option 3: Static Hosting

1. **Build:**
   ```bash
   npx expo export:web
   ```

2. **Upload `web-build/` to:**
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps
   - GitHub Pages

## Mobile Deployment

### iOS (App Store)

1. **Configure:**
   ```bash
   eas build:configure
   ```

2. **Build:**
   ```bash
   eas build --platform ios
   ```

3. **Submit:**
   ```bash
   eas submit --platform ios
   ```

### Android (Play Store)

1. **Build:**
   ```bash
   eas build --platform android
   ```

2. **Submit:**
   ```bash
   eas submit --platform android
   ```

## Weekly Awards Setup

See `AWARDS_SETUP.md` for detailed instructions.

Quick setup:
```bash
supabase functions deploy weekly-awards
```

Then schedule a cron job in Supabase Dashboard.

## Monitoring

### Supabase Dashboard
- Monitor database usage
- Check API logs
- View realtime connections

### Expo Dashboard
- Track app crashes
- Monitor updates
- View analytics

## Performance Optimization

1. **Enable CDN caching** for static assets
2. **Configure image optimization** if using images
3. **Enable gzip compression** on your hosting
4. **Set up monitoring** with Sentry or similar

## Security Checklist

- ✅ Row Level Security enabled on all tables
- ✅ Environment variables properly set
- ✅ No sensitive keys in client code
- ✅ Rate limiting configured in Supabase
- ✅ CORS properly configured

## Post-Deployment

1. **Test all features:**
   - Create posts
   - Flame posts
   - Check daily prompts
   - View weekly awards
   - Test on mobile and web

2. **Monitor for errors:**
   - Check Supabase logs
   - Monitor API errors
   - Watch for performance issues

3. **Set up backups:**
   - Supabase automatic backups enabled
   - Export database regularly

## Scaling

### Database
- Upgrade Supabase plan as needed
- Add indexes for slow queries
- Implement caching for frequently accessed data

### Hosting
- Enable auto-scaling on hosting platform
- Use CDN for static assets
- Implement edge caching

### Cost Optimization
- Monitor Supabase usage
- Optimize queries
- Implement data archiving for old posts

## Troubleshooting

**Web build fails:**
- Clear cache: `rm -rf .expo node_modules/.cache`
- Reinstall: `npm install`
- Try: `npx expo export:web --clear`

**Database connection issues:**
- Verify environment variables
- Check RLS policies
- Ensure proper network access

**Performance issues:**
- Check database indexes
- Monitor query performance
- Optimize large queries
- Implement pagination

## Updates

### Code Updates
```bash
git pull
npm install
npx expo export:web
# Deploy to hosting
```

### Database Updates
- Create migration in `database/migrations/`
- Test in staging
- Apply to production via Supabase Dashboard

## Support

For issues:
1. Check logs in Supabase Dashboard
2. Review error messages in browser console
3. Check Metro bundler output
4. Verify environment variables

## Rollback Plan

If deployment fails:
1. Revert to previous deployment
2. Check error logs
3. Fix issues locally
4. Test thoroughly
5. Redeploy

Keep previous database backup before major migrations.

