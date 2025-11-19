# Fixing "Too Many Open Files" Error

## The Problem
Metro bundler is trying to watch ~40,000 files in `node_modules`, which exceeds macOS's default file descriptor limit.

## Solutions (Try in order)

### Solution 1: Install Watchman (RECOMMENDED)
Watchman is Facebook's file watching service that's much more efficient than Node's built-in file watcher.

**Install via Homebrew:**
```bash
brew install watchman
```

**Or download manually:**
1. Go to https://facebook.github.io/watchman/docs/install.html
2. Download the macOS installer
3. Install it
4. Restart your terminal

After installing Watchman, restart Expo:
```bash
npm start
```

### Solution 2: Increase System Limits Permanently
Add this to your `~/.zshrc` or `~/.bash_profile`:

```bash
# Increase file descriptor limit
ulimit -n 4096
```

Then restart your terminal and run:
```bash
npm start
```

### Solution 3: Use the Shell Script
```bash
./start.sh
```

This script sets the limit and starts Expo.

### Solution 4: Manual Limit Increase
In your terminal, before starting:
```bash
ulimit -n 4096
npm start
```

## Current Configuration

The project is already configured with:
- ✅ Aggressive `blockList` in `metro.config.js` to exclude `node_modules`
- ✅ `.watchmanconfig` to ignore unnecessary directories
- ✅ `.metroignore` file
- ✅ `EXPO_NO_WATCHMAN=1` environment variable in startup script

## Why This Happens

Metro bundler needs to watch files for changes. Without Watchman, it uses Node's FSEvent API which has limitations. With ~40k files in `node_modules`, it exceeds macOS's default limit of 256 open file descriptors.

## Best Long-term Solution

**Install Watchman** - it's the recommended solution for React Native/Expo development and handles file watching much more efficiently.

