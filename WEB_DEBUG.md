# Web Debugging Steps

## Current Issue
Metro bundler returns 500 error when trying to load the web bundle.

## Fixes Applied
1. ✅ Removed manual CSS require() - NativeWind handles CSS via metro.config.js
2. ✅ Fixed Metro blockList to allow expo-router entry
3. ✅ Added web-compatible storage (localStorage)
4. ✅ Made GestureHandlerRootView conditional (not needed on web)

## Next Steps

1. **Restart Metro with cleared cache:**
   ```bash
   rm -rf .expo node_modules/.cache
   npm start
   ```

2. **If still failing, check Metro logs:**
   Look at the terminal where Metro is running for the actual error message.

3. **Try direct web start:**
   ```bash
   npx expo start --web --clear
   ```

4. **Check browser console:**
   Open browser DevTools (F12) and check the Console and Network tabs for detailed errors.

## Common Issues

- **CSS import errors**: NativeWind v4 handles CSS automatically via metro.config.js
- **Module resolution**: Make sure babel-plugin-module-resolver is configured correctly
- **Platform-specific code**: Use Platform.OS checks for web vs native differences

