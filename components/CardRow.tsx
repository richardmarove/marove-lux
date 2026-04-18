import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Card } from '../types';
import { useRef, useState } from 'react';
import { DeleteModal } from './DeleteModal';
import { getLevelLabel } from '../utils/srs';

interface CardRowProps {
  card: Card;
  onDelete: () => void;
}

export function CardRow({ card, onDelete }: CardRowProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setDeleteModalVisible(false);
    swipeableRef.current?.close();
    onDelete();
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        style={styles.deleteAction}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.question} numberOfLines={2}>
              {card.question}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.masteryLabel}>{getLevelLabel(card.level)}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Delete card"
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Swipeable>

      <DeleteModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfacePressed,
  },
  content: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  question: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  masteryLabel: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.accentMuted,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfacePressed,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    overflow: 'hidden',
  },
  deleteButton: {
    padding: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  deleteAction: {
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: theme.spacing.xl,
    width: 80,
  },
});
