import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../theme/theme';
import { useData } from '../context/DataContext';
import { DeckCard } from '../components/DeckCard';
import { EmptyState } from '../components/EmptyState';
import { FAB } from '../components/FAB';
import { Button } from '../components/Button';

export default function Index() {
  const router = useRouter();
  const { decks, addDeck, deleteDeck, getAllDueCards, getDueCountForDeck, isLoaded } = useData();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const totalDueCount = isLoaded ? getAllDueCards().length : 0;

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      addDeck(newDeckName.trim());
      setNewDeckName('');
      setModalVisible(false);
    }
  };

  const handleLongPress = (id: string, name: string) => {
    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteDeck(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          decks.length > 0 ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEyebrow}>Study Queue</Text>
              <Text style={styles.summaryTitle}>
                {isLoaded ? `${totalDueCount} Due Today` : 'Loading due cards...'}
              </Text>
              <Text style={styles.summarySubtitle}>
                {isLoaded
                  ? totalDueCount === 0
                    ? 'You are caught up for now.'
                    : 'Review every due card across all of your decks in one session.'
                  : 'Checking your review schedule from saved progress.'}
              </Text>
              <Button
                title="Quick Study"
                onPress={() => router.push('/study/due')}
                disabled={!isLoaded || totalDueCount === 0}
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <DeckCard
            deck={item}
            subtitle={
              isLoaded
                ? `${getDueCountForDeck(item.id)} due • ${item.cards.length} cards`
                : `${item.cards.length} cards`
            }
            onPress={() => router.push(`/deck/${item.id}`)}
            onLongPress={() => handleLongPress(item.id, item.name)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="albums-outline"
            title="No decks yet"
            subtitle="Create your first flashcard deck to start studying."
          />
        }
      />

      <FAB onPress={() => setModalVisible(true)} />

      {/* Custom Add Deck Modal (since Alert.prompt is iOS only) */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Deck</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Japanese Vocab"
              placeholderTextColor={theme.colors.textSecondary}
              value={newDeckName}
              onChangeText={setNewDeckName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                <Button 
                  title="Cancel" 
                  variant="ghost" 
                  onPress={() => {
                    setModalVisible(false);
                    setNewDeckName('');
                  }} 
                />
              </View>
              <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                <Button title="Create" onPress={handleCreateDeck} disabled={!newDeckName.trim()} />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    padding: theme.spacing.xl,
    paddingBottom: 100, // Space for FAB
    flexGrow: 1,
  },
  summaryCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.surfacePressed,
    ...theme.shadows.sm,
  },
  summaryEyebrow: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.accentMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  summaryTitle: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  summarySubtitle: {
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    ...theme.shadows.md,
  },
  modalTitle: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfacePressed,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
