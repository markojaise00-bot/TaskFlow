import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface ConfirmDeleteModalProps {
  visible: boolean;
  taskTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  taskTitle,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={[styles.dialog, { backgroundColor: theme.background }]}>
          <View style={styles.iconCircle}>
            <ThemedText style={styles.warningIcon}>⚠️</ThemedText>
          </View>
          <ThemedText style={styles.title} type="subtitle">
            Delete Task?
          </ThemedText>
          <ThemedText style={styles.message} type="small">
            Are you sure you want to delete "{taskTitle || 'this task'}"? This action cannot be undone.
          </ThemedText>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.btn, { backgroundColor: theme.backgroundElement }]}
              onPress={onCancel}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </Pressable>

            <Pressable style={[styles.btn, styles.deleteBtn]} onPress={onConfirm}>
              <ThemedText style={styles.deleteText}>Delete</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: 0.75,
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
