const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Aggressively reduce file watching to prevent EMFILE errors
config.watchFolders = [__dirname];

// Ensure react-native-web can be resolved for web builds
// Merge resolver config properly to avoid overwriting defaults
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  sourceExts: [...(Array.isArray(config.resolver?.sourceExts) ? config.resolver.sourceExts : []), 'web.js', 'web.jsx', 'web.ts', 'web.tsx'],
  // Ensure node_modules resolution works
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'),
    ...(Array.isArray(config.resolver?.nodeModulesPaths) ? config.resolver.nodeModulesPaths : []),
  ],
  // Block unnecessary directories from being watched
  // Note: We can't block ALL node_modules as Metro needs to access some packages
  // Don't block build directories in node_modules (needed for @expo/metro-runtime)
  blockList: [
    /node_modules\/.*\/node_modules\/.*/, // Block nested node_modules only
    /^\.git\/.*/,    // Only block .git in project root
    /^\.expo\/.*/,   // Only block .expo in project root
    /^dist\/.*/,     // Only block dist in project root, not node_modules
    /^build\/.*/,    // Only block build in project root, not node_modules
    /^coverage\/.*/, // Only block coverage in project root
    /^database\/.*/, // Only block database in project root
    /^scripts\/.*/,  // Only block scripts in project root
    ...(Array.isArray(config.resolver?.blockList) ? config.resolver.blockList : []),
  ],
};

// Configure watcher to avoid EMFILE errors
config.watcher = {
  usePolling: false,
  additionalExts: ['cjs', 'mjs'],
  healthCheck: {
    enabled: true,
    interval: 30000,
    timeout: 10000,
  },
};

module.exports = withNativeWind(config, { input: './global.css' });

