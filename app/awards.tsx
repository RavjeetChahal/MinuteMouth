import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getWeeklyAwards, AWARDS } from '@/lib/awards';
import { THEME } from '@/constants/theme';

export default function AwardsScreen() {
  const router = useRouter();
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAwards();
  }, []);

  const loadAwards = async () => {
    setLoading(true);
    const weeklyAwards = await getWeeklyAwards();
    setAwards(weeklyAwards);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading awards...</Text>
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
        <Text style={styles.title}>Weekly Awards</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>This Week's Winners 🏆</Text>

        {awards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No awards yet this week</Text>
            <Text style={styles.emptySubtext}>Keep posting and competing!</Text>
          </View>
        ) : (
          awards.map((award) => {
            const awardInfo = AWARDS[award.category];
            if (!awardInfo) return null;

            return (
              <View key={award.category} style={styles.awardCard}>
                <LinearGradient
                  colors={['#FF6B35', '#FF4D1C']}
                  style={styles.awardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.awardEmoji}>{awardInfo.emoji}</Text>
                  <Text style={styles.awardName}>{awardInfo.name}</Text>
                  <Text style={styles.awardDescription}>{awardInfo.description}</Text>
                  
                  <View style={styles.winnerSection}>
                    <Text style={styles.winnerLabel}>Winner:</Text>
                    <Text style={styles.winnerAlias}>{award.users?.alias}</Text>
                  </View>

                  {award.posts && (
                    <View style={styles.postPreview}>
                      <Text style={styles.postText} numberOfLines={2}>
                        "{award.posts.text}"
                      </Text>
                      <Text style={styles.postStats}>
                        🔥 {award.posts.flames} • 💥 {award.posts.super_flames}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </View>
            );
          })
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Weekly Awards</Text>
          <Text style={styles.infoText}>
            Every Sunday at midnight, MinuteMouth calculates the week's winners based on:
          </Text>
          
          {Object.entries(AWARDS).map(([key, award]) => (
            <View key={key} style={styles.awardInfo}>
              <Text style={styles.awardInfoEmoji}>{award.emoji}</Text>
              <View style={styles.awardInfoText}>
                <Text style={styles.awardInfoName}>{award.name}</Text>
                <Text style={styles.awardInfoDesc}>{award.description}</Text>
                {award.permanent && (
                  <Text style={styles.permanentBadge}>🏅 Permanent Badge</Text>
                )}
              </View>
            </View>
          ))}
        </View>
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
  content: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  subtitle: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xxl,
  },
  emptyText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtext: {
    color: THEME.colors.text.muted,
    fontSize: THEME.typography.sizes.md,
  },
  awardCard: {
    marginBottom: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    ...THEME.shadows.md,
  },
  awardGradient: {
    padding: THEME.spacing.lg,
  },
  awardEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  awardName: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  awardDescription: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: THEME.spacing.md,
  },
  winnerSection: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.md,
  },
  winnerLabel: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
    marginBottom: THEME.spacing.xs,
  },
  winnerAlias: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
  },
  postPreview: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  postText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    marginBottom: THEME.spacing.sm,
    fontStyle: 'italic',
  },
  postStats: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
  },
  infoSection: {
    marginTop: THEME.spacing.xl,
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
  },
  infoTitle: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    marginBottom: THEME.spacing.md,
  },
  infoText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.md,
    marginBottom: THEME.spacing.md,
    lineHeight: THEME.typography.sizes.md * 1.5,
  },
  awardInfo: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
    padding: THEME.spacing.sm,
    backgroundColor: 'rgba(255,107,53,0.1)',
    borderRadius: THEME.borderRadius.md,
  },
  awardInfoEmoji: {
    fontSize: 32,
    marginRight: THEME.spacing.sm,
  },
  awardInfoText: {
    flex: 1,
  },
  awardInfoName: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    marginBottom: THEME.spacing.xs,
  },
  awardInfoDesc: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
  },
  permanentBadge: {
    color: THEME.colors.flame.inferno,
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.bold,
    marginTop: THEME.spacing.xs,
  },
  loadingText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.lg,
    textAlign: 'center',
    marginTop: THEME.spacing.xxl,
  },
});

