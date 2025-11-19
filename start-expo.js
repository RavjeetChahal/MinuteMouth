#!/usr/bin/env node

// Set file descriptor limit before starting Expo
const { execSync, spawn } = require('child_process');

// Set environment variable to disable watchman if not installed
process.env.EXPO_NO_WATCHMAN = '1';

try {
  // Try to increase file limit
  execSync('ulimit -n 4096', { shell: '/bin/bash' });
} catch (e) {
  console.warn('Could not set ulimit, continuing anyway...');
}

// Start Expo with no watchman
const expo = spawn('npx', ['expo', 'start', '--clear'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    EXPO_NO_WATCHMAN: '1',
  },
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
  process.exit(1);
});

expo.on('exit', (code) => {
  process.exit(code || 0);
});

