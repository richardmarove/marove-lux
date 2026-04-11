import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'success' | 'danger' | 'ghost' | 'warning';
  disabled?: boolean;
}


export function Button({ onPress, title, variant = 'primary', disabled = false }: ButtonProps) {
  let backgroundColor = theme.colors.accent;
  let textColor = theme.colors.surface;

  if (variant === 'success') {
    backgroundColor = theme.colors.success;
  } else if (variant === 'danger') {
    backgroundColor = theme.colors.danger;
    textColor = theme.colors.textPrimary;
  } else if (variant === 'warning') { // Also handle warning
    backgroundColor = theme.colors.tryAgain;
    textColor = theme.colors.surfacePressed;
  } else if (variant === 'ghost') {
    backgroundColor = theme.colors.transparent;
    textColor = theme.colors.accent;
  }

  if (disabled) {
    backgroundColor = theme.colors.surfacePressed;
    textColor = theme.colors.textSecondary;
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontFamily: theme.typography.fonts.bodyBold,
    fontSize: theme.typography.sizes.md,
  },
});
