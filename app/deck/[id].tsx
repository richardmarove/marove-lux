import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { theme } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { CardRow } from '../../components/CardRow';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';

export default function DeckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { decks, deleteCard, getDueCountForDeck, isLoaded } = useData();

  const deck = decks.find(d => d.id === id);

  if (!deck) {
    return <View style={styles.container} />;
  }

  const dueCount = isLoaded ? getDueCountForDeck(deck.id) : 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: deck.name }} />
      
      <FlatList
        data={deck.cards}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.summaryText}>
              {isLoaded ? `${dueCount} Due / ${deck.cards.length} Total` : 'Loading review status...'}
            </Text>
            <View style={styles.primaryAction}>
              <Button 
                title="Study Due" 
                onPress={() => router.push(`/study/${deck.id}?mode=due`)}
                disabled={!isLoaded || dueCount === 0}
              />
            </View>
            <Button 
              title="Cram All Cards" 
              variant="ghost"
              onPress={() => router.push(`/study/${deck.id}?mode=all`)}
              disabled={!isLoaded || deck.cards.length === 0}
            />
          </View>
        }
        renderItem={({ item }) => (
          <CardRow
            card={item}
            onDelete={() => deleteCard(deck.id, item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="albums-outline"
            title="No cards yet"
            subtitle="Add question and answer pairs to start studying."
          />
        }
      />

      <View style={styles.footer}>
        <Button 
          title="Add New Card" 
          variant="ghost" 
          onPress={() => router.push(`/add-card/${deck.id}`)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl * 3, // space for footer
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  summaryText: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  primaryAction: {
    marginBottom: theme.spacing.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfacePressed,
  },
});
