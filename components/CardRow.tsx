import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Card } from '../types';
import { useRef, useState } from 'react';
import { DeleteModal } from './DeleteModal';

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
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
    >
      <View style={styles.container}>
        <Text style={styles.question} numberOfLines={2}>
          {card.question}
        </Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <DeleteModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfacePressed,
  },
  question: {
    flex: 1,
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.md,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  deleteAction: {
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: theme.spacing.xl,
    width: 80,
  },
});
