import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/Button';

export default function AddCardScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const router = useRouter();
  const { addCard } = useData();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      setError('Both Question and Answer are required.');
      return;
    }
    addCard(deckId, question.trim(), answer.trim());
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Question</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What is the capital of..."
          placeholderTextColor={theme.colors.textSecondary}
          value={question}
          onChangeText={text => { setQuestion(text); setError(''); }}
          multiline
          autoFocus
        />

        <View style={{ height: theme.spacing.xl }} />

        <Text style={styles.label}>Answer</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="The capital is..."
          placeholderTextColor={theme.colors.textSecondary}
          value={answer}
          onChangeText={text => { setAnswer(text); setError(''); }}
          multiline
        />

      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
             <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
          </View>
          <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
             <Button title="Save Card" onPress={handleSave} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    padding: theme.spacing.xl,
    flexGrow: 1,
  },
  label: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.accentMuted,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.colors.surfaceElevated,
    borderColor: theme.colors.surfacePressed,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.md,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.danger,
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfacePressed,
  },
  footerRow: {
    flexDirection: 'row',
  },
});
