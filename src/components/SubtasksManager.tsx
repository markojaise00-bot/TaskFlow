import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Subtask } from '@/types/task';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface SubtasksManagerProps {
  subtasks: Subtask[];
  onToggle?: (subtaskId: string) => void;
  onAdd?: (title: string) => void;
  onDelete?: (subtaskId: string) => void;
  readOnly?: boolean;
}

export const SubtasksManager: React.FC<SubtasksManagerProps> = ({
  subtasks,
  onToggle,
  onAdd,
  onDelete,
  readOnly = false,
}) => {
  const theme = useTheme();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    if (onAdd) {
      onAdd(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.headerTitle} type="smallBold">
          Checklist ({completedCount}/{totalCount})
        </ThemedText>
        {totalCount > 0 && (
          <ThemedText style={styles.pctText} type="small">
            {progressPct}% Done
          </ThemedText>
        )}
      </View>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      )}

      {/* Subtask Items */}
      {subtasks.map((item) => (
        <View
          key={item.id}
          style={[styles.itemRow, { backgroundColor: theme.backgroundElement }]}>
          <Pressable
            disabled={readOnly || !onToggle}
            onPress={() => onToggle && onToggle(item.id)}
            style={styles.itemLeft}>
            <View
              style={[
                styles.checkbox,
                item.completed && styles.checkboxDone,
                { borderColor: item.completed ? '#059669' : '#9CA3AF' },
              ]}>
              {item.completed && <ThemedText style={styles.checkmark}>✓</ThemedText>}
            </View>
            <ThemedText
              style={[styles.itemTitle, item.completed && styles.itemTitleDone]}
              type="small">
              {item.title}
            </ThemedText>
          </Pressable>

          {!readOnly && onDelete && (
            <Pressable hitSlop={8} onPress={() => onDelete(item.id)}>
              <ThemedText style={styles.deleteIcon}>✕</ThemedText>
            </Pressable>
          )}
        </View>
      ))}

      {/* Add Subtask Input */}
      {!readOnly && onAdd && (
        <View style={styles.addRow}>
          <TextInput
            style={[
              styles.addInput,
              { backgroundColor: theme.backgroundElement, color: theme.text },
            ]}
            placeholder="Add a step or subtask..."
            placeholderTextColor={theme.textSecondary}
            value={newSubtaskTitle}
            onChangeText={setNewSubtaskTitle}
            onSubmitEditing={handleAddSubtask}
            returnKeyType="done"
          />
          <Pressable style={styles.addBtn} onPress={handleAddSubtask}>
            <ThemedText style={styles.addBtnText}>+ Add</ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 14,
  },
  pctText: {
    fontSize: 12,
    opacity: 0.65,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: '#059669',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: -1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  itemTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  deleteIcon: {
    fontSize: 14,
    opacity: 0.5,
    paddingLeft: 8,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  addInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
