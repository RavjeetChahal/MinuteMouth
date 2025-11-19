import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Post } from '@/types';
import { THEME, getHeatGradient } from '@/constants/theme';
import { CATEGORY_LABELS } from '@/constants/categories';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from 'react-native-reanimated';

interface FeedCardProps {
  post: Post;
  onFlame: () => void;
  onSuperFlame: () => void;
}

export function FeedCard({ post, onFlame, onSuperFlame }: FeedCardProps) {
  const glowOpacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (post.heat_level === 'inferno') {
      glowOpacity.value = withRepeat(
        withTiming(0.8, { duration: 1000 }),
        -1,
        true
      );
    }
  }, [post.heat_level]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleDoubleTap = () => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
    onSuperFlame();
  };

  const gradientColors = getHeatGradient(post.heat_level);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowContainer, animatedGlowStyle]}>
        <LinearGradient
          colors={gradientColors}
          style={styles.glow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.card, animatedScaleStyle]}>
        <LinearGradient
          colors={['rgba(26, 26, 46, 0.95)', 'rgba(15, 52, 96, 0.85)', 'rgba(10, 10, 10, 0.95)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <View style={[styles.categoryBadge, { backgroundColor: THEME.colors.category[post.category] }]}>
              <Text style={styles.categoryText}>{CATEGORY_LABELS[post.category]}</Text>
            </View>
            <View style={[styles.heatBadge, { backgroundColor: THEME.colors.flame[post.heat_level] }]}>
              <Text style={styles.heatText}>{post.heat_level.toUpperCase()}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.textContainer}
            onPress={onFlame}
            onLongPress={handleDoubleTap}
            activeOpacity={0.9}
          >
            <Text style={styles.postText}>{post.text}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <View style={styles.flameContainer}>
              <Text style={styles.flameEmoji}>🔥</Text>
              <Text style={styles.flameCount}>{post.flames}</Text>
            </View>
            <View style={styles.superFlameContainer}>
              <Text style={styles.superFlameEmoji}>💥</Text>
              <Text style={styles.superFlameCount}>{post.super_flames}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    zIndex: 0,
  },
  glow: {
    flex: 1,
    borderRadius: THEME.borderRadius.xl,
  },
  card: {
    flex: 1,
    margin: 20,
    borderRadius: THEME.borderRadius.xxl,
    overflow: 'hidden',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  categoryText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.text.primary,
  },
  heatBadge: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heatText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text.primary,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  postText: {
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text.primary,
    textAlign: 'center',
    lineHeight: THEME.typography.sizes.xxl * 1.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 53, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: THEME.borderRadius.xl,
  },
  flameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  flameEmoji: {
    fontSize: THEME.typography.sizes.lg,
  },
  flameCount: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.text.primary,
  },
  superFlameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  superFlameEmoji: {
    fontSize: THEME.typography.sizes.lg,
  },
  superFlameCount: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.text.primary,
  },
});

