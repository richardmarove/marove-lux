import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={32} color={theme.colors.surface} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xxxl,
    right: theme.spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
});
