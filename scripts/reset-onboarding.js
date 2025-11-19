#!/usr/bin/env node
/**
 * Reset onboarding for testing
 * Run this in browser console:
 */

console.log(`
🔄 Reset MinuteMouth Onboarding
================================

To reset and test the onboarding flow:

1. Open browser console (F12)
2. Run these commands:

localStorage.removeItem('device_uuid');
localStorage.removeItem('onboarding_complete');
location.reload();

3. You should see the onboarding screen with a funny username!
4. Click "🎲 Roll New Name" to get different usernames
5. Click "Let's Go! 🚀" when you find one you like

================================
`);

