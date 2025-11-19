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
      colors={['#0A0A0A', '#1A1A2E', '#0F3460', '#16213E']}
      style={styles.container}
      locations={[0, 0.3, 0.7, 1]}
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
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 107, 53, 0.4)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#FFB84D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButton: {
    width: '100%',
    marginBottom: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.xl,
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

