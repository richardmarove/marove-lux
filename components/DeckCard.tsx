import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme/theme';
import { Deck } from '../types';

interface DeckCardProps {
  deck: Deck;
  onPress: () => void;
  onLongPress?: () => void;
}

export function DeckCard({ deck, onPress, onLongPress }: DeckCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <Text style={styles.title}>{deck.name}</Text>
        <Text style={styles.subtitle}>{deck.cards.length} cards</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  accentBar: {
    width: 6,
    backgroundColor: theme.colors.accent,
  },
  content: {
    padding: theme.spacing.xl,
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
});
