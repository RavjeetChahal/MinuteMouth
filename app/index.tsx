import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0A0A0A', '#1A1A2E', '#0F3460', '#16213E']}
      style={styles.container}
      locations={[0, 0.3, 0.7, 1]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>MinuteMouth</Text>
        <Text style={styles.subtitle}>UMass Anonymous Chaos</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/feed')}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF4D1C']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Enter the Feed</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/prompt')}
          >
            <LinearGradient
              colors={['#FF8C42', '#FF6B35']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Today's Prompt</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/your-takes')}
          >
            <LinearGradient
              colors={['#FFB84D', '#FF8C42']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Your Takes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/awards')}
          >
            <LinearGradient
              colors={['#FF4D1C', '#FF2E2E']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>🏆 Weekly Awards</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    padding: THEME.spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.lg,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: THEME.spacing.xxl,
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: THEME.spacing.md,
  },
  button: {
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.text.primary,
  },
});

