import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../theme/theme';
import { Card } from '../types';

interface FlashCardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashCard({ card, isFlipped, onFlip }: FlashCardProps) {
  const flipAnim = useSharedValue(isFlipped ? 1 : 0);

  // Sync prop changes to animation value
  flipAnim.value = withSpring(isFlipped ? 1 : 0, {
    damping: 15,
    stiffness: 100,
    mass: 1,
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  // Shift shadow as card flips for realism
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const shadowOffset = interpolate(flipAnim.value, [0, 0.5, 1], [5, 15, 5]);
    const shadowOpacity = interpolate(flipAnim.value, [0, 0.5, 1], [0.3, 0.1, 0.3]);
    return {
      shadowOffset: { width: 0, height: shadowOffset },
      shadowOpacity,
    };
  });

  return (
    <Pressable style={styles.container} onPress={onFlip}>
      <Animated.View style={[styles.cardWrapper, containerAnimatedStyle]}>
        {/* FRONT => Question */}
        <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerBottomRight} />
          <Text style={styles.sideLabel}>QUESTION</Text>
          <Text style={styles.questionText}>{card.question}</Text>
        </Animated.View>

        {/* BACK => Answer */}
        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          <Text style={styles.sideLabel}>ANSWER</Text>
          <Text style={styles.answerText}>{card.answer}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '90%',
    aspectRatio: 3 / 4,
    ...theme.shadows.md,
    shadowColor: '#000',
    shadowRadius: 10,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfacePressed,
  },
  frontCard: {
    // Front side styles
  },
  backCard: {
    // Back side styles
  },
  cornerTopLeft: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: theme.colors.accentMuted,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.colors.accentMuted,
  },
  sideLabel: {
    position: 'absolute',
    top: theme.spacing.xl,
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.accentMuted,
    letterSpacing: 2,
  },
  questionText: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
  answerText: {
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
});
