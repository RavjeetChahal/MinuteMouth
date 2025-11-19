import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { Prompt } from '@/types';
import { THEME } from '@/constants/theme';
import { getTodayPrompt, applyDynamicTags } from '@/lib/prompts';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

export default function PromptScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    loadPrompt();
    
    // Animated background glow
    glowOpacity.value = withRepeat(
      withTiming(0.6, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const loadPrompt = async () => {
    setLoading(true);
    const todayPrompt = await getTodayPrompt();
    setPrompt(todayPrompt);
    setLoading(false);
  };

  const handleWriteTake = () => {
    router.push({
      pathname: '/compose',
      params: { category: prompt?.category || 'chaos' },
    });
  };

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading prompt...</Text>
      </View>
    );
  }

  if (!prompt) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No prompt available</Text>
        <TouchableOpacity onPress={loadPrompt} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayText = applyDynamicTags(prompt.text, prompt.dynamic_tags || {});

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1A1A1A', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.glowContainer, animatedGlowStyle]}>
            <LinearGradient
              colors={['#FF6B35', '#FF4D1C', '#FF2E2E']}
              style={styles.glow}
            />
          </Animated.View>

          <View style={styles.promptContainer}>
            <Text style={styles.promptLabel}>Today's Prompt</Text>
            <Text style={styles.promptText}>{displayText}</Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.chaosBadge}>
                <Text style={styles.chaosText}>
                  Chaos Level: {prompt.chaos_level}/5
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.writeButton}
            onPress={handleWriteTake}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF4D1C']}
              style={styles.writeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.writeButtonText}>Write Your Take</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
  },
  backButton: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.md,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  glowContainer: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    height: '60%',
    borderRadius: THEME.borderRadius.xl,
  },
  glow: {
    flex: 1,
    borderRadius: THEME.borderRadius.xl,
  },
  promptContainer: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.xl,
    zIndex: 1,
    ...THEME.shadows.lg,
  },
  promptLabel: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    marginBottom: THEME.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promptText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: THEME.typography.weights.bold,
    lineHeight: THEME.typography.sizes.xxl * 1.4,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
  metaContainer: {
    alignItems: 'center',
  },
  chaosBadge: {
    backgroundColor: THEME.colors.flame.chaotic,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.full,
  },
  chaosText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
  },
  writeButton: {
    width: '100%',
    maxWidth: 400,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    ...THEME.shadows.md,
  },
  writeButtonGradient: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
  },
  loadingText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    textAlign: 'center',
    marginTop: THEME.spacing.xxl,
  },
  errorText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    textAlign: 'center',
    marginTop: THEME.spacing.xxl,
  },
  retryButton: {
    marginTop: THEME.spacing.md,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.flame.spicy,
    borderRadius: THEME.borderRadius.md,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
  },
});

