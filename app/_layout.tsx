import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getOrCreateDeviceIdentity, isOnboardingComplete } from '@/lib/deviceIdentity';
// CSS is handled by NativeWind via metro.config.js

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function initializeApp() {
      try {
        // Initialize device identity first
        await getOrCreateDeviceIdentity();
        
        // Check if onboarding is complete
        const onboardingComplete = await isOnboardingComplete();
        setNeedsOnboarding(!onboardingComplete);
        setIsReady(true);

        // Navigate to onboarding if needed
        if (!onboardingComplete) {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsReady(true);
      }
    }

    initializeApp();
  }, []);

  const content = (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="index" />
      <Stack.Screen name="feed" />
      <Stack.Screen name="compose" />
      <Stack.Screen name="prompt" />
      <Stack.Screen name="your-takes" />
      <Stack.Screen name="awards" />
    </Stack>
  );

  // Wrap in GestureHandlerRootView only on native platforms
  if (Platform.OS === 'web') {
    return content;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {content}
    </GestureHandlerRootView>
  );
}

