import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { generateRandomAlias } from '@/constants/aliases';
import { supabase } from '@/lib/supabase';
import { getDeviceUUID } from '@/lib/deviceIdentity';
import { THEME } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const [alias, setAlias] = useState(generateRandomAlias());
  const [loading, setLoading] = useState(false);

  const rollNewName = () => {
    setAlias(generateRandomAlias());
  };

  const confirmAlias = async () => {
    setLoading(true);
    try {
      const uuid = await getDeviceUUID();
      
      if (!uuid) {
        console.error('No device UUID found');
        return;
      }

      // Create user in database with chosen alias
      const { createUserInDatabase, setOnboardingComplete } = await import('@/lib/deviceIdentity');
      const success = await createUserInDatabase(uuid, alias);

      if (!success) {
        console.error('Failed to create user in database');
        alert('Failed to create account. Please try again.');
        return;
      }

      // Mark onboarding as complete
      await setOnboardingComplete();

      // Navigate to home
      router.replace('/');
    } catch (error) {
      console.error('Error confirming alias:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1A1A1A', '#881C1C']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to MinuteMouth</Text>
        <Text style={styles.subtitle}>The most unhinged app on campus 🔥</Text>

        <View style={styles.aliasContainer}>
          <Text style={styles.label}>Your Anonymous Identity:</Text>
          <View style={styles.aliasCard}>
            <Text style={styles.aliasText}>{alias}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.rollButton}
          onPress={rollNewName}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FFB84D', '#FF8C42']}
            style={styles.buttonGradient}
          >
            <Text style={styles.rollButtonText}>🎲 Roll New Name</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmAlias}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FF6B35', '#FF4D1C']}
            style={styles.buttonGradient}
          >
            <Text style={styles.confirmButtonText}>
              {loading ? 'Loading...' : "Let's Go! 🚀"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          You're completely anonymous. No login, no email, just chaos.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
  title: {
    fontSize: 42,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.lg,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xxl,
  },
  aliasContainer: {
    width: '100%',
    marginBottom: THEME.spacing.xl,
  },
  label: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  aliasCard: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: THEME.colors.flame.inferno,
    ...THEME.shadows.lg,
  },
  aliasText: {
    fontSize: 32,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text.primary,
    textAlign: 'center',
  },
  rollButton: {
    width: '100%',
    marginBottom: THEME.spacing.md,
  },
  confirmButton: {
    width: '100%',
    marginBottom: THEME.spacing.xl,
  },
  buttonGradient: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  rollButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
  },
  confirmButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
  },
  disclaimer: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

