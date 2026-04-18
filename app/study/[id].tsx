import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useData } from '../../context/DataContext';
import { StudySessionScreen } from '../../components/StudySessionScreen';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { theme } from '../../theme/theme';

function StudyUnavailable({
  title,
  subtitle,
  buttonTitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  buttonTitle: string;
  onBack: () => void;
}) {
  return (
    <View style={styles.container}>
      <EmptyState icon="albums-outline" title={title} subtitle={subtitle} />
      <View style={styles.emptyAction}>
        <Button title={buttonTitle} variant="ghost" onPress={onBack} />
      </View>
    </View>
  );
}

export default function StudyScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const router = useRouter();
  const { decks, getDueCardsForDeck, reviewCard, isLoaded } = useData();
  const sessionMode = mode === 'due' ? 'due' : 'all';

  const deck = decks.find(d => d.id === id);
  const sessionItems =
    !deck
      ? []
      : (sessionMode === 'due' ? getDueCardsForDeck(deck.id) : deck.cards).map(card => ({
          deckId: deck.id,
          deckName: deck.name,
          card,
        }));

  if (isLoaded && !deck) {
    return (
      <StudyUnavailable
        title="Deck not found"
        subtitle="This deck is no longer available."
        buttonTitle="Back to Decks"
        onBack={() => router.replace('/')}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ title: sessionMode === 'due' ? 'Study Due' : 'Cram All Cards' }}
      />
      <StudySessionScreen
        sessionKey={`${id}:${sessionMode}`}
        items={sessionItems}
        mode={sessionMode}
        isLoaded={isLoaded}
        emptyTitle={sessionMode === 'due' ? 'Nothing due in this deck' : 'No cards in this deck'}
        emptySubtitle={
          sessionMode === 'due'
            ? 'Add more cards or wait until reviews come due again.'
            : 'Add some cards before starting a cram session.'
        }
        completionTitle={sessionMode === 'due' ? 'Due Cards Cleared' : undefined}
        backButtonTitle="Back to Deck"
        onReview={(item, result) => reviewCard(item.deckId, item.card.id, result)}
        onBack={() => router.replace(`/deck/${id}`)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  emptyAction: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
});
