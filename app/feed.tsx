import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { FeedCard } from '@/components/FeedCard';
import { THEME } from '@/constants/theme';
import { calculateHeatLevel } from '@/constants/heatLevels';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type FeedTab = 'hot-now' | 'most-unhinged' | 'top-week' | 'rising-stars';

export default function FeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<FeedTab>('hot-now');
  const translateY = useSharedValue(0);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async (tab: FeedTab) => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    switch (tab) {
      case 'hot-now':
        // Posts with flames in last 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        query = supabase
          .from('posts')
          .select('*')
          .gte('created_at', thirtyMinutesAgo)
          .order('flames', { ascending: false })
          .limit(50);
        break;
      case 'most-unhinged':
        query = supabase
          .from('posts')
          .select('*')
          .eq('heat_level', 'chaotic')
          .or('heat_level.eq.inferno')
          .order('flames', { ascending: false })
          .limit(50);
        break;
      case 'top-week':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = supabase
          .from('posts')
          .select('*')
          .gte('created_at', weekAgo)
          .order('flames', { ascending: false })
          .limit(50);
        break;
      case 'rising-stars':
        // Posts with high acceleration (recent posts with growing flames)
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        query = supabase
          .from('posts')
          .select('*')
          .gte('created_at', hourAgo)
          .order('flames', { ascending: false })
          .limit(50);
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading posts:', error);
    } else {
      setPosts(data || []);
      setCurrentIndex(0);
      translateY.value = 0;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts(activeTab);

    // Subscribe to realtime updates
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        () => {
          loadPosts(activeTab);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, loadPosts]);

  const handleFlame = async (postId: number) => {
    const { data: post } = await supabase
      .from('posts')
      .select('flames, super_flames')
      .eq('id', postId)
      .single();

    if (post) {
      const newFlames = (post.flames || 0) + 1;
      const heatLevel = calculateHeatLevel(newFlames, post.super_flames || 0);
      
      await supabase
        .from('posts')
        .update({ flames: newFlames, heat_level: heatLevel })
        .eq('id', postId);
    }
  };

  const handleSuperFlame = async (postId: number) => {
    const { data: post } = await supabase
      .from('posts')
      .select('flames, super_flames')
      .eq('id', postId)
      .single();

    if (post) {
      const newSuperFlames = (post.super_flames || 0) + 1;
      const heatLevel = calculateHeatLevel(post.flames || 0, newSuperFlames);
      
      await supabase
        .from('posts')
        .update({ super_flames: newSuperFlames, heat_level: heatLevel })
        .eq('id', postId);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const threshold = SCREEN_HEIGHT * 0.2;
      
      if (event.translationY < -threshold && currentIndex > 0) {
        // Swipe up - previous post
        translateY.value = withSpring(SCREEN_HEIGHT, {}, () => {
          runOnJS(setCurrentIndex)(currentIndex - 1);
          translateY.value = 0;
        });
      } else if (event.translationY > threshold && currentIndex < posts.length - 1) {
        // Swipe down - next post
        translateY.value = withSpring(-SCREEN_HEIGHT, {}, () => {
          runOnJS(setCurrentIndex)(currentIndex + 1);
          translateY.value = 0;
        });
      } else {
        // Snap back
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const currentPost = posts[currentIndex];

  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!currentPost) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No posts yet. Be the first!</Text>
        <TouchableOpacity
          style={styles.composeButton}
          onPress={() => router.push('/compose')}
        >
          <Text style={styles.composeButtonText}>Post Something</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {(['hot-now', 'most-unhinged', 'top-week', 'rising-stars'] as FeedTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <FeedCard
            post={currentPost}
            onFlame={() => handleFlame(currentPost.id)}
            onSuperFlame={() => handleSuperFlame(currentPost.id)}
          />
        </Animated.View>
      </GestureDetector>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/compose')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: THEME.spacing.sm,
    paddingBottom: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: THEME.spacing.sm,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: THEME.colors.flame.spicy,
  },
  tabText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.text.secondary,
    fontWeight: THEME.typography.weights.medium,
  },
  activeTabText: {
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  cardContainer: {
    flex: 1,
  },
  loadingText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    textAlign: 'center',
    marginTop: THEME.spacing.xxl,
  },
  emptyText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    textAlign: 'center',
    marginTop: THEME.spacing.xxl,
  },
  composeButton: {
    marginTop: THEME.spacing.lg,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.flame.spicy,
    borderRadius: THEME.borderRadius.md,
    alignSelf: 'center',
  },
  composeButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.flame.inferno,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadows.lg,
  },
  fabText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: THEME.typography.weights.bold,
  },
});

