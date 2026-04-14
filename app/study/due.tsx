import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useData } from '../../context/DataContext';
import { StudySessionScreen } from '../../components/StudySessionScreen';

export default function GlobalDueStudyScreen() {
  const router = useRouter();
  const { getAllDueCards, reviewCard, isLoaded } = useData();

  return (
    <>
      <Stack.Screen options={{ title: 'Quick Study' }} />
      <StudySessionScreen
        sessionKey="global-due"
        items={getAllDueCards()}
        mode="due"
        isLoaded={isLoaded}
        showDeckName
        emptyTitle="Nothing due right now"
        emptySubtitle="You have already cleared every due card across your decks."
        completionTitle="Due Cards Cleared"
        backButtonTitle="Back Home"
        onReview={(item, result) => reviewCard(item.deckId, item.card.id, result)}
        onBack={() => router.replace('/')}
      />
    </>
  );
}
