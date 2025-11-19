import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { getDeviceUUID } from '@/lib/deviceIdentity';
import { Category } from '@/types';
import { THEME } from '@/constants/theme';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/categories';
import { calculateHeatLevel } from '@/constants/heatLevels';

const getPlaceholder = (category: Category): string => {
  const placeholders = {
    dining: "The dining hall food today was...",
    dorms: "Living in my dorm is like...",
    majors: "My major has me feeling...",
    professors: "Professor Smith just said the wildest thing...",
    greek: "Greek life at UMass is...",
    dating: "Dating on campus is actually...",
    overheard: "Just overheard someone say...",
    roommates: "My roommate literally...",
    chaos: "Nobody talks about how...",
  };
  return placeholders[category];
};

const getHint = (category: Category): string => {
  const hints = {
    dining: "Share your honest dining hall experience",
    dorms: "Vent about dorm life or roommate stories",
    majors: "Complain about workload or celebrate victories",
    professors: "Anonymous professor reviews or funny moments",
    greek: "Greek life tea or party stories",
    dating: "Campus dating hot takes",
    overheard: "Share the wild things you've heard",
    roommates: "Roommate drama or wholesome moments",
    chaos: "Unfiltered campus truths",
  };
  return hints[category];
};

export default function ComposeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>((params.category as Category) || 'chaos');
  const [alias, setAlias] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUserAlias();
  }, []);

  const loadUserAlias = async () => {
    const uuid = await getDeviceUUID();
    if (uuid) {
      const { data } = await supabase
        .from('users')
        .select('alias')
        .eq('uuid', uuid)
        .single();
      
      if (data) {
        setAlias(data.alias);
      }
    }
  };

  const handleSubmit = async () => {
    if (text.trim().length === 0 || text.length > 300) {
      Alert.alert('Invalid Post', 'Please write something between 1-300 characters');
      return;
    }

    setSubmitting(true);
    const uuid = await getDeviceUUID();

    if (!uuid) {
      console.error('No device UUID found');
      Alert.alert('Error', 'Please restart the app and complete onboarding');
      setSubmitting(false);
      return;
    }

    // Verify user exists in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('uuid')
      .eq('uuid', uuid)
      .maybeSingle();

    if (userError || !userData) {
      console.error('User not found in database:', userError);
      Alert.alert('Error', 'Please restart the app and complete onboarding');
      setSubmitting(false);
      return;
    }

    const heatLevel = calculateHeatLevel(0, 0);

    console.log('Submitting post:', {
      user_uuid: uuid,
      text: text.trim(),
      category,
      flames: 0,
      super_flames: 0,
      heat_level: heatLevel,
    });

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_uuid: uuid,
        text: text.trim(),
        category,
        flames: 0,
        super_flames: 0,
        heat_level: heatLevel,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } else {
      console.log('Post created successfully:', data);
      setText('');
      router.push('/feed');
    }

    setSubmitting(false);
  };

  const charCount = text.length;
  const canSubmit = text.trim().length > 0 && text.length <= 300 && !submitting;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Post Your Take</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {alias && (
            <View style={styles.aliasContainer}>
              <Text style={styles.aliasLabel}>Posting as:</Text>
              <Text style={styles.alias}>{alias}</Text>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={getPlaceholder(category)}
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={300}
              autoFocus
              textAlignVertical="top"
            />
            {text.length === 0 && (
              <Text style={styles.hintText}>
                💡 {getHint(category)}
              </Text>
            )}
          </View>

          <Text style={styles.charCount}>
            {charCount}/300
          </Text>

          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && {
                      backgroundColor: CATEGORY_COLORS[cat],
                    },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 53, 0.1)',
  },
  cancelButton: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.md,
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.semibold,
  },
  submitButton: {
    color: THEME.colors.flame.spicy,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
  },
  submitButtonDisabled: {
    color: THEME.colors.text.muted,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  aliasContainer: {
    marginBottom: THEME.spacing.md,
    padding: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
  },
  aliasLabel: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
    marginBottom: THEME.spacing.xs,
  },
  alias: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
  },
  inputWrapper: {
    marginBottom: THEME.spacing.md,
  },
  input: {
    minHeight: 200,
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.lg,
    padding: THEME.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    marginBottom: THEME.spacing.xs,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: THEME.typography.sizes.sm,
    fontStyle: 'italic',
    marginLeft: THEME.spacing.md,
  },
  charCount: {
    color: THEME.colors.text.muted,
    fontSize: THEME.typography.sizes.sm,
    textAlign: 'right',
    marginBottom: THEME.spacing.lg,
  },
  categorySection: {
    marginTop: THEME.spacing.md,
  },
  categoryLabel: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    marginBottom: THEME.spacing.sm,
  },
  categoryScroll: {
    marginHorizontal: -THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: THEME.spacing.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  categoryChipText: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
  },
  categoryChipTextActive: {
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.weights.bold,
  },
});

