# Weekly Awards Setup Guide

## Overview

MinuteMouth calculates weekly awards every Sunday at 11:59 PM to recognize the best posters of the week.

## Awards

1. **👑🔥 Inferno King** (Permanent Badge)
   - Most inferno posts this week
   - Permanent badge added to profile

2. **🎭 Mouth of Madness**
   - Highest total flames this week

3. **😂 Comedy Crime**
   - Most super flames (funniest posts)

4. **💯 Too Real Trophy**
   - Most relatable/engaging post

5. **😈 Campus Menace**
   - Most chaotic + inferno posts combined

## Setup Options

### Option 1: Supabase Edge Function (Recommended)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Link your project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy weekly-awards
   ```

4. **Set up a cron job in Supabase:**
   - Go to Supabase Dashboard
   - Navigate to Database → Cron Jobs
   - Create a new cron job:
     ```sql
     SELECT
       net.http_post(
           url:='https://your-project-ref.supabase.co/functions/v1/weekly-awards',
           headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
           body:='{}'::jsonb
       ) as request_id;
     ```
   - Schedule: `59 23 * * 0` (Every Sunday at 11:59 PM)

### Option 2: Manual Cron Job

1. **Add npm script to package.json:**
   ```json
   {
     "scripts": {
       "awards:calculate": "ts-node scripts/calculate-weekly-awards.ts"
     }
   }
   ```

2. **Set up a cron job on your server:**
   ```bash
   crontab -e
   ```
   
   Add this line:
   ```
   59 23 * * 0 cd /path/to/MinuteMouth && npm run awards:calculate
   ```

### Option 3: GitHub Actions

Create `.github/workflows/weekly-awards.yml`:

```yaml
name: Calculate Weekly Awards

on:
  schedule:
    - cron: '59 23 * * 0'  # Every Sunday at 11:59 PM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  calculate-awards:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - name: Calculate Awards
        env:
          EXPO_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          EXPO_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: npm run awards:calculate
```

## Testing

Test the awards calculation manually:

```bash
# Via npm script
npm run awards:calculate

# Via ts-node
ts-node scripts/calculate-weekly-awards.ts

# Via Supabase Edge Function
curl -X POST https://your-project-ref.supabase.co/functions/v1/weekly-awards \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

## Viewing Awards

Users can view weekly awards:
1. Open the app
2. Tap "🏆 Weekly Awards" from the home screen
3. See this week's winners and their winning posts

## Database

Awards are stored in the `awards_weekly` table:
- `week_number`: ISO week number
- `category`: Award type
- `winner_uuid`: Winner's device UUID
- `post_id`: Winning post

Winners with permanent badges have them added to their `badges` array in the `users` table.

## Troubleshooting

**No awards calculated:**
- Check that posts exist from the past week
- Verify Supabase connection
- Check cron job logs

**Badges not showing:**
- Verify RLS policies allow badge updates
- Check user exists in database
- Restart the app to refresh

**Edge Function errors:**
- Verify environment variables are set
- Check Supabase logs in Dashboard
- Ensure service role key has correct permissions

