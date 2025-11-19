import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { getDeviceUUID } from '@/lib/deviceIdentity';
import { Category } from '@/types';
import { THEME } from '@/constants/theme';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/categories';
import { calculateHeatLevel } from '@/constants/heatLevels';

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
      return;
    }

    setSubmitting(true);
    const uuid = await getDeviceUUID();

    if (!uuid) {
      console.error('No device UUID found');
      setSubmitting(false);
      return;
    }

    const heatLevel = calculateHeatLevel(0, 0);

    const { error } = await supabase
      .from('posts')
      .insert({
        user_uuid: uuid,
        text: text.trim(),
        category,
        flames: 0,
        super_flames: 0,
        heat_level: heatLevel,
      });

    if (error) {
      console.error('Error creating post:', error);
    } else {
      router.back();
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
        colors={['#000000', '#1A1A1A']}
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

          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor={THEME.colors.text.muted}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={300}
            autoFocus
            textAlignVertical="top"
          />

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
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surface,
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
  input: {
    minHeight: 200,
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.sizes.xl,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
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
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surface,
    marginRight: THEME.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
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

