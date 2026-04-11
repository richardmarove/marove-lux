import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { FlashCard } from '../../components/FlashCard';
import { ProgressBar } from '../../components/ProgressBar';
import { CompletionScreen } from '../../components/CompletionScreen';
import { Button } from '../../components/Button';
import { Card } from '../../types';

export default function StudyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { decks } = useData();

  const deck = decks.find(d => d.id === id);

  const [queue, setQueue] = useState<Card[]>([]);
  const [learnedCount, setLearnedCount] = useState(0);
  const [totalInitialCards, setTotalInitialCards] = useState(0);
  
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize session
  useEffect(() => {
    if (deck && deck.cards.length > 0) {
      // Shuffle cards for study queue
      const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setTotalInitialCards(shuffled.length);
      setCurrentCard(shuffled[0]);
    }
  }, [deck]);

  const advanceCard = (newQueue: Card[], nextLearnedCount: number) => {
    setIsFlipped(false); // Reset flip state first
    setTimeout(() => {
      setQueue(newQueue);
      setLearnedCount(nextLearnedCount);
      
      if (newQueue.length === 0) {
        setIsComplete(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setCurrentCard(newQueue[0]);
      }
    }, 200); // Wait for flip to un-flip visually before changing text
  };

  const handleGotIt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newQueue = queue.slice(1);
    advanceCard(newQueue, learnedCount + 1);
  };

  const handleTryAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Move current card to back of queue
    const current = queue[0];
    const rest = queue.slice(1);
    
    // Add a bit of randomness so it's not always exactly last if queue is long, 
    // but just pushing to end is standard.
    const newQueue = [...rest, current];
    advanceCard(newQueue, learnedCount);
  };

  const handleRestart = () => {
    if (!deck) return;
    setIsComplete(false);
    setLearnedCount(0);
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentCard(shuffled[0]);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    Haptics.selectionAsync();
    setIsFlipped(!isFlipped);
  };

  if (!deck || !currentCard) return null;

  const progress = totalInitialCards === 0 ? 0 : learnedCount / totalInitialCards;

  return (
    <View style={styles.container}>
      {isComplete ? (
        <CompletionScreen 
          totalCards={totalInitialCards}
          onStudyAgain={handleRestart}
          onBackToDeck={() => router.back()}
        />
      ) : (
        <>
          <ProgressBar 
            progress={progress} 
            label={`${learnedCount} of ${totalInitialCards} Learned`}
          />

          <View style={styles.cardContainer}>
             <FlashCard 
                card={currentCard}
                isFlipped={isFlipped}
                onFlip={handleFlip}
             />
          </View>

          <View style={styles.actions}>
            {!isFlipped ? (
              <Text style={styles.instruction}>Tap the card to reveal the answer</Text>
            ) : (
              <View style={styles.buttonRow}>
                <View style={styles.buttonWrapper}>
                  <Button title="Try Again" variant="warning" onPress={handleTryAgain} />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button title="Got It" variant="success" onPress={handleGotIt} />
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    marginVertical: theme.spacing.xl,
  },
  actions: {
    height: 120, // fixed height to prevent layout jump on flip
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
});
