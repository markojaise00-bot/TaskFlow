import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Category, Priority, Task } from '@/types/task';
import { SubtasksManager } from './SubtasksManager';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface TaskFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description?: string;
    priority: Priority;
    category?: Category;
    dueDate?: string;
    subtasks?: string[];
  }) => Promise<void>;
  initialTask?: Task | null;
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTask,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState<Category>('Personal');
  const [dueDate, setDueDate] = useState('');
  const [subtasksList, setSubtasksList] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description || '');
        setPriority(initialTask.priority);
        setCategory(initialTask.category || 'Personal');
        setDueDate(initialTask.dueDate || '');
        setSubtasksList((initialTask.subtasks || []).map((s) => s.title));
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setCategory('Personal');
        setDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
        setSubtasksList([]);
      }
      setNewSubtaskInput('');
      setError('');
      setIsSubmitting(false);
    }
  }, [visible, initialTask]);

  const handleAddSubtaskItem = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasksList([...subtasksList, newSubtaskInput.trim()]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtaskItem = (index: number) => {
    setSubtasksList(subtasksList.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate.trim() || undefined,
        subtasks: subtasksList,
      });
      onClose();
    } catch (e) {
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle} type="subtitle">
              {initialTask ? 'Edit Task' : 'New Task'}
            </ThemedText>
            <Pressable hitSlop={8} onPress={onClose}>
              <ThemedText style={styles.closeBtn}>✕</ThemedText>
            </Pressable>
          </View>

          <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Title <ThemedText style={styles.requiredStar}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    color: theme.text,
                    borderColor: error ? '#EF4444' : theme.backgroundSelected,
                  },
                ]}
                placeholder="Enter task title..."
                placeholderTextColor={theme.textSecondary}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (text.trim()) setError('');
                }}
              />
              {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Description (Optional)</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.backgroundElement,
                    color: theme.text,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
                placeholder="Add more details about this task..."
                placeholderTextColor={theme.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Category</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.chipBtn,
                        {
                          backgroundColor: isSelected ? '#2563EB' : theme.backgroundElement,
                        },
                      ]}>
                      <ThemedText
                        style={[
                          styles.chipText,
                          { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                        ]}>
                        {cat}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Due Date & Priority Row */}
            <View style={styles.rowTwo}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.label}>Due Date (YYYY-MM-DD)</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundElement,
                      color: theme.text,
                      borderColor: theme.backgroundSelected,
                    },
                  ]}
                  placeholder="2026-08-15"
                  placeholderTextColor={theme.textSecondary}
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.label}>Priority</ThemedText>
                <View style={styles.priorityGroup}>
                  {PRIORITIES.map((p) => {
                    const isSelected = priority === p;
                    let activeBg = '#2563EB';
                    if (p === 'Low') activeBg = '#059669';
                    if (p === 'Medium') activeBg = '#D97706';
                    if (p === 'High') activeBg = '#DC2626';

                    return (
                      <Pressable
                        key={p}
                        onPress={() => setPriority(p)}
                        style={[
                          styles.priorityBtn,
                          {
                            backgroundColor: isSelected ? activeBg : theme.backgroundElement,
                          },
                        ]}>
                        <ThemedText
                          style={[
                            styles.priorityText,
                            { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                          ]}>
                          {p.substring(0, 3)}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Checklist / Subtasks Section */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Checklist Steps</ThemedText>

              {subtasksList.map((st, idx) => (
                <View key={idx} style={[styles.subtaskChipRow, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText style={styles.subtaskChipText} type="small">
                    • {st}
                  </ThemedText>
                  <Pressable hitSlop={8} onPress={() => handleRemoveSubtaskItem(idx)}>
                    <ThemedText style={styles.removeSubtaskText}>✕</ThemedText>
                  </Pressable>
                </View>
              ))}

              <View style={styles.subtaskAddInputRow}>
                <TextInput
                  style={[
                    styles.input,
                    { flex: 1, backgroundColor: theme.backgroundElement, color: theme.text },
                  ]}
                  placeholder="Add a step..."
                  placeholderTextColor={theme.textSecondary}
                  value={newSubtaskInput}
                  onChangeText={setNewSubtaskInput}
                  onSubmitEditing={handleAddSubtaskItem}
                />
                <Pressable style={styles.addSubtaskBtn} onPress={handleAddSubtaskItem}>
                  <ThemedText style={styles.addSubtaskBtnText}>+ Add</ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.btn, styles.cancelBtn, { backgroundColor: theme.backgroundElement }]}
              onPress={onClose}
              disabled={isSubmitting}>
              <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.saveBtn, { opacity: isSubmitting ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              <ThemedText style={styles.saveBtnText}>
                {isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '88%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.6,
    padding: 4,
  },
  formContainer: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#EF4444',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 70,
  },
  scrollRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  priorityGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subtaskChipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  subtaskChipText: {
    fontSize: 13,
  },
  removeSubtaskText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13,
  },
  subtaskAddInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  addSubtaskBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addSubtaskBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelBtn: {},
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#2563EB',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
