import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '../theme/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${progress * 100}%`, { damping: 20, stiffness: 90 }),
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedFillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  label: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  track: {
    height: 6,
    backgroundColor: theme.colors.surfacePressed,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.full,
  },
});
