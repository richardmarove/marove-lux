import React, { useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { theme } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { CardRow } from '../../components/CardRow';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';

export default function DeckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { decks, deleteCard } = useData();

  const deck = decks.find(d => d.id === id);

  if (!deck) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: deck.name }} />
      
      <FlatList
        data={deck.cards}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button 
              title="Study Now" 
              onPress={() => router.push(`/study/${deck.id}`)}
              disabled={deck.cards.length === 0}
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
