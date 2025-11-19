import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#000000', '#1A1A1A', '#000000']}
      style={styles.container}
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
    fontSize: THEME.typography.sizes.xxxl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.typography.sizes.lg,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xxl,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: THEME.spacing.md,
  },
  button: {
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: THEME.spacing.md,
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

