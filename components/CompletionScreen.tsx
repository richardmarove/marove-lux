import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from './Button';
import { theme } from '../theme/theme';

interface CompletionScreenProps {
  totalCards: number;
  onStudyAgain: () => void;
  onBackToDeck: () => void;
}

export function CompletionScreen({ totalCards, onStudyAgain, onBackToDeck }: CompletionScreenProps) {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.title}>Session Complete</Text>
      <Text style={styles.subtitle}>You've reviewed {totalCards} cards.</Text>

      <View style={styles.actions}>
        <Button title="Study Again" onPress={onStudyAgain} variant="primary" />
        <View style={{ height: theme.spacing.md }} />
        <Button title="Back to Deck" onPress={onBackToDeck} variant="ghost" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    zIndex: 10,
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxxl,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
});
