import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import { theme } from '../theme/theme';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ visible, onClose, onConfirm }: DeleteModalProps) {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [visible]);

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onConfirm();
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        {/* We use a full-screen pressable for backdrop dismissal */}
        <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
        
        {visible && (
          <View style={styles.card}>
            <View style={styles.content}>
              <Text style={styles.title}>Delete Card?</Text>
              <Text style={styles.message}>
                This action cannot be undone. Are you sure you want to discard this item permanently?
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfacePressed,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 24,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.xxl,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xxl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfacePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: theme.typography.fonts.bodyMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: theme.typography.fonts.bodyBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
