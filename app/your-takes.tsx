import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { getDeviceUUID } from '@/lib/deviceIdentity';
import { Post, User } from '@/types';
import { THEME } from '@/constants/theme';
import { CATEGORY_LABELS } from '@/constants/categories';

export default function YourTakesScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    const uuid = await getDeviceUUID();

    if (!uuid) {
      setLoading(false);
      return;
    }

    // Load user info
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (userData) {
      setUser(userData);
    }

    // Load user's posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_uuid', uuid)
      .order('created_at', { ascending: false });

    if (postsData) {
      setPosts(postsData);
    }

    setLoading(false);
  };

  const totalFlames = posts.reduce((sum, post) => sum + post.flames, 0);
  const totalSuperFlames = posts.reduce((sum, post) => sum + post.super_flames, 0);
  const infernoPosts = posts.filter((post) => post.heat_level === 'inferno').length;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#1A1A1A']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Takes</Text>
        <View style={{ width: 60 }} />
      </View>

      {user && (
        <View style={styles.profileSection}>
          <Text style={styles.alias}>{user.alias}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalFlames}</Text>
              <Text style={styles.statLabel}>Flames</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalSuperFlames}</Text>
              <Text style={styles.statLabel}>Super Flames</Text>
            </View>
            {infernoPosts > 0 && (
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: THEME.colors.flame.inferno }]}>
                  {infernoPosts}
                </Text>
                <Text style={styles.statLabel}>Inferno</Text>
              </View>
            )}
          </View>

          {user.badges && user.badges.length > 0 && (
            <View style={styles.badgesContainer}>
              <Text style={styles.badgesLabel}>Badges:</Text>
              <View style={styles.badgesList}>
                {user.badges.map((badge, index) => (
                  <View key={index} style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <ScrollView style={styles.postsContainer}>
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <TouchableOpacity
              style={styles.composeButton}
              onPress={() => router.push('/compose')}
            >
              <Text style={styles.composeButtonText}>Post Your First Take</Text>
            </TouchableOpacity>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: THEME.colors.category[post.category] }]}>
                  <Text style={styles.categoryText}>{CATEGORY_LABELS[post.category]}</Text>
                </View>
                <View style={[styles.heatBadge, { backgroundColor: THEME.colors.flame[post.heat_level] }]}>
                  <Text style={styles.heatText}>{post.heat_level.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.postText}>{post.text}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.postMeta}>
                  🔥 {post.flames} • 💥 {post.super_flames}
                </Text>
                <Text style={styles.postDate}>
                  {new Date(post.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surface,
  },
  backButton: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.md,
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
  },
  profileSection: {
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surface,
  },
  alias: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    marginBottom: THEME.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
  },
  statLabel: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
    marginTop: THEME.spacing.xs,
  },
  badgesContainer: {
    marginTop: THEME.spacing.md,
  },
  badgesLabel: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
    marginBottom: THEME.spacing.sm,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  badge: {
    backgroundColor: THEME.colors.flame.spicy,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
  },
  badgeText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
  },
  postsContainer: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.xxl,
  },
  emptyText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    marginBottom: THEME.spacing.lg,
  },
  composeButton: {
    backgroundColor: THEME.colors.flame.spicy,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  composeButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
  },
  postCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  categoryText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.text.primary,
  },
  heatBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  heatText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text.primary,
  },
  postText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    lineHeight: THEME.typography.sizes.md * 1.5,
    marginBottom: THEME.spacing.sm,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  postMeta: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
  },
  postDate: {
    color: THEME.colors.text.muted,
    fontSize: THEME.typography.sizes.xs,
  },
  loadingText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    textAlign: 'center',
    marginTop: THEME.spacing.xxl,
  },
});

