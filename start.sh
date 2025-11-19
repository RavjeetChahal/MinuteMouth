#!/bin/bash

# Increase file descriptor limit to prevent EMFILE errors
ulimit -n 4096 2>/dev/null || echo "Warning: Could not set ulimit"

# Disable watchman if not installed
export EXPO_NO_WATCHMAN=1

# Start Expo with cleared cache
npx expo start --clear

