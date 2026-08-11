import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Task } from '@/types/task';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const router = useRouter();
  const theme = useTheme();
  const isCompleted = task.status === 'Completed';

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/task/[id]', params: { id: task.id } } as any)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
          opacity: pressed ? 0.92 : isCompleted ? 0.75 : 1,
        },
      ]}>
      <View style={styles.topRow}>
        {/* Toggle Checkbox */}
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation();
            onToggleStatus(task.id);
          }}
          style={[
            styles.checkbox,
            isCompleted && styles.checkboxCompleted,
            { borderColor: isCompleted ? '#059669' : '#9CA3AF' },
          ]}>
          {isCompleted && <ThemedText style={styles.checkmark}>✓</ThemedText>}
        </Pressable>

        {/* Content Box */}
        <View style={styles.content}>
          <View style={styles.badgeLine}>
            <PriorityBadge priority={task.priority} size="small" />
            <CategoryBadge category={task.category} size="small" />
          </View>

          <ThemedText
            style={[styles.title, isCompleted && styles.completedTitle]}
            numberOfLines={1}>
            {task.title}
          </ThemedText>

          {task.description ? (
            <ThemedText style={styles.description} numberOfLines={2} type="small">
              {task.description}
            </ThemedText>
          ) : null}

          {/* Subtasks Progress & Due Date */}
          <View style={styles.metaRow}>
            {subtasks.length > 0 ? (
              <ThemedText style={styles.subtaskTag} type="small">
                ☑ {completedSubtasks}/{subtasks.length} steps
              </ThemedText>
            ) : null}

            {dueDateFormatted ? (
              <ThemedText style={styles.dueDateTag} type="small">
                📅 Due {dueDateFormatted}
              </ThemedText>
            ) : null}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation();
            onToggleStatus(task.id);
          }}
          style={styles.statusToggleBtn}>
          <ThemedText style={[styles.statusToggleText, { color: isCompleted ? '#D97706' : '#059669' }]}>
            Mark {isCompleted ? 'Pending' : 'Completed'}
          </ThemedText>
        </Pressable>

        <View style={styles.rightActions}>
          {onEdit && (
            <Pressable
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              style={styles.actionBtn}>
              <ThemedText style={styles.actionText}>Edit</ThemedText>
            </Pressable>
          )}

          {onDelete && (
            <Pressable
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              style={styles.actionBtn}>
              <ThemedText style={[styles.actionText, { color: '#EF4444' }]}>Delete</ThemedText>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#059669',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: -2,
  },
  content: {
    flex: 1,
  },
  badgeLine: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    opacity: 0.75,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  subtaskTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  dueDateTag: {
    fontSize: 12,
    opacity: 0.65,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  statusToggleBtn: {
    paddingVertical: 4,
  },
  statusToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
});
