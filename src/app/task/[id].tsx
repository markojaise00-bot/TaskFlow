import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { PriorityBadge } from '@/components/PriorityBadge';
import { SubtasksManager } from '@/components/SubtasksManager';
import { TaskFormModal } from '@/components/TaskFormModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { useTheme } from '@/hooks/use-theme';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const {
    getTaskById,
    toggleTaskStatus,
    editTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
  } = useTasks();

  const task = getTaskById(id as string);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  if (!task) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.notFoundContainer}>
            <ThemedText style={styles.notFoundIcon}>❓</ThemedText>
            <ThemedText style={styles.notFoundTitle} type="subtitle">
              Task Not Found
            </ThemedText>
            <ThemedText style={styles.notFoundSubtitle} type="small">
              The task you are looking for may have been deleted or moved.
            </ThemedText>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <ThemedText style={styles.backBtnText}>← Go Back</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const isCompleted = task.status === 'Completed';

  const fullDateFormatted = new Date(task.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const handleSaveEdit = async (data: any) => {
    await editTask(task.id, data);
  };

  const handleConfirmDelete = async () => {
    await deleteTask(task.id);
    setIsDeleteModalVisible(false);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Navigation */}
        <View style={styles.headerBar}>
          <Pressable hitSlop={12} style={styles.headerBackBtn} onPress={() => router.back()}>
            <ThemedText style={styles.headerBackText}>← Back</ThemedText>
          </Pressable>

          <ThemedText style={styles.headerTitle} type="smallBold">
            Task Details
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Main Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
            ]}>
            {/* Status, Category & Priority Row */}
            <View style={styles.badgeRow}>
              <View style={styles.badgeLeft}>
                <PriorityBadge priority={task.priority} size="medium" />
                <CategoryBadge category={task.category} size="medium" />
              </View>

              <Pressable
                onPress={() => toggleTaskStatus(task.id)}
                style={[
                  styles.statusBadge,
                  { backgroundColor: isCompleted ? '#ECFDF5' : '#FEF3C7' },
                ]}>
                <ThemedText
                  style={[
                    styles.statusBadgeText,
                    { color: isCompleted ? '#047857' : '#B45309' },
                  ]}>
                  {isCompleted ? '✓ Completed' : '⏳ Pending'}
                </ThemedText>
              </Pressable>
            </View>

            {/* Title */}
            <ThemedText style={[styles.title, isCompleted && styles.completedTitle]}>
              {task.title}
            </ThemedText>

            {/* Dates Row */}
            <View style={styles.dateContainer}>
              {dueDateFormatted ? (
                <View style={styles.dateRow}>
                  <ThemedText style={styles.dateLabel} type="small">
                    Due Date:
                  </ThemedText>
                  <ThemedText style={styles.dueDateValue} type="small">
                    📅 {dueDateFormatted}
                  </ThemedText>
                </View>
              ) : null}

              <View style={styles.dateRow}>
                <ThemedText style={styles.dateLabel} type="small">
                  Created:
                </ThemedText>
                <ThemedText style={styles.dateValue} type="small">
                  {fullDateFormatted}
                </ThemedText>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description Section */}
            <ThemedText style={styles.descriptionHeader} type="smallBold">
              Description
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
              {task.description || 'No detailed description provided for this task.'}
            </ThemedText>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Interactive Subtasks Checklist */}
            <SubtasksManager
              subtasks={task.subtasks || []}
              onToggle={(stId) => toggleSubtask(task.id, stId)}
              onAdd={(stTitle) => addSubtask(task.id, stTitle)}
              onDelete={(stId) => deleteSubtask(task.id, stId)}
            />
          </View>

          {/* Quick Toggle Banner */}
          <Pressable
            style={[
              styles.toggleBanner,
              { backgroundColor: isCompleted ? '#FFFBEB' : '#ECFDF5' },
            ]}
            onPress={() => toggleTaskStatus(task.id)}>
            <ThemedText
              style={[
                styles.toggleBannerText,
                { color: isCompleted ? '#B45309' : '#047857' },
              ]}>
              {isCompleted ? 'Mark task as Pending' : 'Mark task as Completed ✓'}
            </ThemedText>
          </Pressable>

          {/* Edit & Delete Action Buttons */}
          <View style={styles.actionGrid}>
            <Pressable style={styles.editBtn} onPress={() => setIsEditModalVisible(true)}>
              <ThemedText style={styles.editBtnText}>✏️ Edit Task</ThemedText>
            </Pressable>

            <Pressable style={styles.deleteBtn} onPress={() => setIsDeleteModalVisible(true)}>
              <ThemedText style={styles.deleteBtnText}>🗑️ Delete Task</ThemedText>
            </Pressable>
          </View>
        </ScrollView>

        {/* Modals */}
        <TaskFormModal
          visible={isEditModalVisible}
          initialTask={task}
          onClose={() => setIsEditModalVisible(false)}
          onSave={handleSaveEdit}
        />

        <ConfirmDeleteModal
          visible={isDeleteModalVisible}
          taskTitle={task.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  headerBackBtn: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  headerBackText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  headerTitle: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 12,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  dateContainer: {
    gap: 4,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateLabel: {
    opacity: 0.6,
    fontWeight: '600',
  },
  dateValue: {
    fontWeight: '600',
  },
  dueDateValue: {
    fontWeight: '700',
    color: '#D97706',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    marginVertical: 14,
  },
  descriptionHeader: {
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.7,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  toggleBanner: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleBannerText: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },
  notFoundContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  notFoundSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
