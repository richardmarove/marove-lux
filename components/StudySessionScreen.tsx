import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme/theme';
import { ReviewResult, ReviewState, StudyQueueItem } from '../types';
import { FlashCard } from './FlashCard';
import { ProgressBar } from './ProgressBar';
import { CompletionScreen } from './CompletionScreen';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { formatNextReviewMessage } from '../utils/srs';

type StudySessionMode = 'due' | 'all';

interface StudySessionScreenProps {
  sessionKey: string;
  items: StudyQueueItem[];
  mode: StudySessionMode;
  isLoaded: boolean;
  showDeckName?: boolean;
  emptyTitle: string;
  emptySubtitle: string;
  completionTitle?: string;
  backButtonTitle: string;
  onReview: (item: StudyQueueItem, result: ReviewResult) => ReviewState;
  onBack: () => void;
}

function shuffleItems<T>(items: T[]): T[] {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

export function StudySessionScreen({
  sessionKey,
  items,
  mode,
  isLoaded,
  showDeckName = false,
  emptyTitle,
  emptySubtitle,
  completionTitle,
  backButtonTitle,
  onReview,
  onBack,
}: StudySessionScreenProps) {
  const [queue, setQueue] = useState<StudyQueueItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [initialCount, setInitialCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedSessionKeyRef = useRef<string | null>(null);

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const clearFeedback = useCallback(() => {
    clearFeedbackTimeout();
    setFeedbackMessage('');
  }, [clearFeedbackTimeout]);

  const initializeSession = useCallback((nextItems: StudyQueueItem[]) => {
    clearAdvanceTimeout();
    clearFeedback();

    const shuffledItems = shuffleItems(nextItems);

    setQueue(shuffledItems);
    setCompletedCount(0);
    setInitialCount(shuffledItems.length);
    setIsFlipped(false);
    setIsComplete(false);
    setIsTransitioning(false);
    setHasInitialized(true);
  }, [clearAdvanceTimeout, clearFeedback]);

  useEffect(() => {
    setHasInitialized(false);
  }, [sessionKey]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (initializedSessionKeyRef.current === sessionKey) {
      return;
    }

    initializedSessionKeyRef.current = sessionKey;
    initializeSession(items);
  }, [initializeSession, isLoaded, items, sessionKey]);

  useEffect(() => {
    return () => {
      clearAdvanceTimeout();
      clearFeedbackTimeout();
    };
  }, [clearAdvanceTimeout, clearFeedbackTimeout]);

  const currentItem = queue[0] ?? null;
  const progress = initialCount === 0 ? 0 : completedCount / initialCount;
  const progressLabel =
    mode === 'due'
      ? `${queue.length} remaining of ${initialCount} due`
      : `${completedCount} of ${initialCount} reviewed`;

  const showFeedback = (nextReviewAt: number) => {
    clearFeedbackTimeout();
    setFeedbackMessage(formatNextReviewMessage(nextReviewAt));
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage('');
      feedbackTimeoutRef.current = null;
    }, 1500);
  };

  const advanceCard = (nextQueue: StudyQueueItem[], nextCompletedCount: number) => {
    clearAdvanceTimeout();
    setIsTransitioning(true);
    setIsFlipped(false);

    advanceTimeoutRef.current = setTimeout(() => {
      setQueue(nextQueue);
      setCompletedCount(nextCompletedCount);

      if (nextQueue.length === 0) {
        setIsComplete(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setIsTransitioning(false);
      advanceTimeoutRef.current = null;
    }, 200);
  };

  const handleFlip = () => {
    if (isTransitioning) {
      return;
    }

    Haptics.selectionAsync();
    setIsFlipped(currentValue => !currentValue);
  };

  const handleGotIt = () => {
    if (!currentItem || isTransitioning) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const reviewState = onReview(currentItem, 'success');
    showFeedback(reviewState.nextReviewAt);
    advanceCard(queue.slice(1), completedCount + 1);
  };

  const handleTryAgain = () => {
    if (!currentItem || isTransitioning) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearFeedback();
    onReview(currentItem, 'failure');
    advanceCard([...queue.slice(1), currentItem], completedCount);
  };

  if (!isLoaded || !hasInitialized) {
    return <View style={styles.container} />;
  }

  if (isComplete) {
    return (
      <View style={styles.container}>
        <CompletionScreen
          totalCards={initialCount}
          title={completionTitle}
          subtitle={
            mode === 'due'
              ? `You cleared ${initialCount} due card${initialCount === 1 ? '' : 's'}.`
              : undefined
          }
          onStudyAgain={() => initializeSession(items)}
          onBack={onBack}
          backButtonTitle={backButtonTitle}
        />
      </View>
    );
  }

  if (initialCount === 0 || !currentItem) {
    return (
      <View style={styles.container}>
        <EmptyState icon="checkmark-done-outline" title={emptyTitle} subtitle={emptySubtitle} />
        <View style={styles.emptyAction}>
          <Button title={backButtonTitle} variant="ghost" onPress={onBack} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} label={progressLabel} />

      <View style={styles.contextHeader}>
        {showDeckName ? <Text style={styles.deckName}>{currentItem.deckName}</Text> : null}
        {feedbackMessage ? <Text style={styles.feedback}>{feedbackMessage}</Text> : null}
      </View>

      <View style={styles.cardContainer}>
        <FlashCard card={currentItem.card} isFlipped={isFlipped} onFlip={handleFlip} />
      </View>

      <View style={styles.actions}>
        {!isFlipped ? (
          <Text style={styles.instruction}>Tap the card to reveal the answer</Text>
        ) : (
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button
                title="Try Again"
                variant="warning"
                onPress={handleTryAgain}
                disabled={isTransitioning}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="Got It"
                variant="success"
                onPress={handleGotIt}
                disabled={isTransitioning}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  contextHeader: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  deckName: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.accentMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  feedback: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.accent,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    marginVertical: theme.spacing.xl,
  },
  actions: {
    height: 120,
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
  emptyAction: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
});
