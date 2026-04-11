import { View, Text, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Card } from '../types';
import { useRef } from 'react';

interface CardRowProps {
  card: Card;
  onDelete: () => void;
}

export function CardRow({ card, onDelete }: CardRowProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = () => {
    return (
      <View style={styles.deleteAction}>
        <Ionicons name="trash-outline" size={24} color={theme.colors.textPrimary} />
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') {
          onDelete();
        }
      }}
    >
      <View style={styles.container}>
        <Text style={styles.question} numberOfLines={2}>
          {card.question}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfacePressed,
  },
  question: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  deleteAction: {
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: theme.spacing.xl,
    width: '100%',
  },
});
