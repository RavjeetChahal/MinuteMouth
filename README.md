# 🔥 MinuteMouth

**The chaotic anonymous feed for UMass students**

Post whatever, get flamed instantly, climb the chaos ladder. No login, no filters, pure unhinged campus vibes.

![Status: Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Platform: iOS | Android | Web](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-orange)

## 🚀 Quick Start

```bash
# Clone the repo
git clone <your-repo-url>
cd MinuteMouth

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# Run database setup (see SETUP.md)

# Start development server
npm start

# Press 'w' for web, 'i' for iOS, 'a' for Android
```

## ✨ Features

### Core
- **100% Anonymous** - No accounts, no emails, just post
- **Device Identity** - Unique UUID per device, persisted securely
- **TikTok-Style Feed** - Vertical swipe, addictive scrolling
- **Flame System** - Regular flames 🔥 and super flames 💥 (worth 3x)
- **Heat Levels** - Posts evolve: mild → hot → spicy → chaotic → inferno
- **Daily Prompts** - Fresh chaotic prompt every day
- **Weekly Awards** - 5 categories, permanent badges for legends

### Content
- **9 Categories**: Dining, Dorms, Social Life, Classes, Campus Events, Party Scene, Campus Opinions, Random Chaos, Confessions
- **300+ Prompts**: Community-driven unhinged questions
- **Multiple Feeds**: Hot Now, Most Unhinged, Top This Week, Rising Stars
- **Smart Algorithm**: Posts heat up based on engagement velocity

### Social
- **Give Flames**: Regular or super (3x weight)
- **Win Awards**: Weekly competitions with permanent badges
- **Your Takes**: Track your posts and their performance
- **Anonymous**: No profiles, no followers, pure content

## 📱 Screenshots

[Add screenshots here after deployment]

## 🏗️ Tech Stack

- **Frontend**: React Native + Expo
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animations**: React Native Reanimated + Gesture Handler
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Device-based UUIDs (no login)
- **Storage**: SecureStore (native) / localStorage (web)
- **Realtime**: Supabase Realtime
- **Deployment**: Vercel (web), EAS (mobile)

## 📁 Project Structure

```
MinuteMouth/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   ├── feed.tsx           # Main swipe feed
│   ├── compose.tsx        # Post composer
│   ├── prompt.tsx         # Daily prompt
│   ├── your-takes.tsx     # User's posts
│   └── awards.tsx         # Weekly awards
├── components/            # Reusable UI components
├── lib/                   # Core logic
│   ├── supabase.ts       # Supabase client
│   ├── deviceIdentity.ts # Device UUID system
│   ├── prompts.ts        # Prompt generator
│   └── awards.ts         # Awards calculator
├── constants/            # Design tokens & data
├── types/                # TypeScript types
├── utils/                # Helper functions
├── database/             # SQL schema & seeds
├── supabase/            # Edge functions
└── scripts/             # Automation scripts
```

## 🎨 Design System

### Color Palette (Heat Levels)
- **Mild**: `#FFB84D` - Yellow-orange glow
- **Hot**: `#FF8C42` - Orange heat
- **Spicy**: `#FF6B35` - Red-orange flame
- **Chaotic**: `#FF4D1C` - Bright red chaos
- **Inferno**: `#FF2E2E` - Crimson wildfire
- **UMass Maroon**: `#881C1C` - Brand accent

### Typography
- **Display**: Bold, high contrast
- **Body**: Clean, readable
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

### Components
- Gradient buttons with linear gradients
- Animated flame meters
- Heat level glows for inferno posts
- Smooth card transitions

## 🏆 Weekly Awards

Every Sunday at 11:59 PM, MinuteMouth calculates:

1. **👑🔥 Inferno King** - Most inferno posts (permanent badge)
2. **🎭 Mouth of Madness** - Highest total flames
3. **😂 Comedy Crime** - Most super flames (funniest)
4. **💯 Too Real Trophy** - Most engaging post
5. **😈 Campus Menace** - Most chaotic content

See `AWARDS_SETUP.md` for automation setup.

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Expo CLI

### Installation

1. **Clone and install:**
   ```bash
   git clone <repo>
   cd MinuteMouth
   npm install
   ```

2. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com)
   - Run `database/schema.sql` in SQL Editor
   - Copy URL and anon key to `.env`

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Add to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Seed prompts:**
   ```bash
   npm run seed:prompts
   ```

5. **Start dev server:**
   ```bash
   npm start
   ```

See `SETUP.md` for detailed instructions.

## 🚢 Deployment

### Web (Recommended: Vercel)
```bash
npx expo export:web
vercel --prod
```

### Mobile (EAS Build)
```bash
eas build --platform ios
eas build --platform android
```

See `DEPLOYMENT.md` for full guides.

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Platform-specific deployment
- **AWARDS_SETUP.md** - Weekly awards automation
- **FIX_EMFILE.md** - Troubleshooting file limits
- **WEB_DEBUG.md** - Web debugging tips
- **PROJECT_COMPLETE.md** - Project overview

## 🔒 Security & Privacy

- **Anonymous by Design**: No personal information collected
- **Device UUIDs**: Cryptographically random, locally stored
- **Row Level Security**: All database tables protected
- **No Tracking**: No analytics, no third-party tracking
- **UMass Only**: (Optional) Add email verification in production

## 🧪 Testing

```bash
# Unit tests (if added)
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 🐛 Known Issues

All major issues resolved! See closed issues for history:
- ✅ Metro EMFILE errors
- ✅ Web bundle MIME type issues
- ✅ React Native Web compatibility
- ✅ Module resolution errors

## 🛣️ Roadmap

### V1.0 (Complete) ✅
- [x] Core feed & posting
- [x] Flame system
- [x] Daily prompts
- [x] Weekly awards
- [x] Web deployment

### V2.0 (Future)
- [ ] Image uploads
- [ ] Push notifications
- [ ] User blocking/reporting
- [ ] Moderation dashboard
- [ ] Advanced analytics
- [ ] Post search
- [ ] Share to social media

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🎓 About

MinuteMouth is a student project designed for UMass Amherst students. It's inspired by anonymous campus forums and modern social feed mechanics.

**Built with**: Expo, React Native, Supabase, NativeWind, Reanimated

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Check documentation in `/docs`
- Review error logs in Supabase Dashboard

## 🙏 Acknowledgments

- UMass Amherst community for inspiration
- Expo team for amazing tooling
- Supabase for backend infrastructure
- React Native community

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Platform**: Web, iOS, Android  
**License**: MIT

🔥 **Built for chaos. Made for UMass.** 🔥
