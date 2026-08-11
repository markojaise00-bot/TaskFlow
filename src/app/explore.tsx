import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { SettingsModal } from '@/components/SettingsModal';
import { TaskCard } from '@/components/TaskCard';
import { TaskFilterBar } from '@/components/TaskFilterBar';
import { TaskFormModal } from '@/components/TaskFormModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { Task } from '@/types/task';

export default function TasksScreen() {
  const {
    filteredTasks,
    tasks,
    isLoading,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    addTask,
    editTask,
    toggleTaskStatus,
    deleteTask,
    clearCompletedTasks,
  } = useTasks();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleSaveTask = async (data: any) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await addTask(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const hasActiveFilters =
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All' ||
    searchQuery !== '';

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <ThemedText style={styles.headerTitle} type="subtitle">
                    Task List
                  </ThemedText>
                  <ThemedText style={styles.taskCountText} type="small">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </ThemedText>
                </View>

                <View style={styles.headerActions}>
                  <Pressable
                    hitSlop={8}
                    style={styles.settingsHeaderBtn}
                    onPress={() => setIsSettingsModalVisible(true)}>
                    <ThemedText style={styles.settingsIcon}>⚙️</ThemedText>
                  </Pressable>

                  <Pressable style={styles.addBtn} onPress={() => setIsAddModalVisible(true)}>
                    <ThemedText style={styles.addBtnText}>+ Add Task</ThemedText>
                  </Pressable>
                </View>
              </View>

              {/* Bulk Actions Banner */}
              {completedCount > 0 && (
                <View style={styles.bulkBanner}>
                  <ThemedText style={styles.bulkText} type="small">
                    {completedCount} task{completedCount > 1 ? 's' : ''} completed
                  </ThemedText>
                  <Pressable onPress={clearCompletedTasks}>
                    <ThemedText style={styles.clearLink} type="small">
                      Clear Completed
                    </ThemedText>
                  </Pressable>
                </View>
              )}

              {/* Filter & Sort Bar */}
              <TaskFilterBar
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                sortOption={sortOption}
                setSortOption={setSortOption}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </View>
          }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleStatus={toggleTaskStatus}
              onEdit={(t) => setEditingTask(t)}
              onDelete={(t) => setTaskToDelete(t)}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <ThemedText style={styles.loadingText} type="small">
                  Loading tasks...
                </ThemedText>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyIcon}>
                  {hasActiveFilters ? '🔍' : '📋'}
                </ThemedText>
                <ThemedText style={styles.emptyTitle}>
                  {hasActiveFilters ? 'No matching tasks' : 'No tasks found'}
                </ThemedText>
                <ThemedText style={styles.emptySubtitle} type="small">
                  {hasActiveFilters
                    ? 'Try clearing or adjusting your search, category, and filter options.'
                    : 'Get started by creating your first task.'}
                </ThemedText>

                {hasActiveFilters ? (
                  <Pressable
                    style={styles.clearFilterBtn}
                    onPress={() => {
                      setStatusFilter('All');
                      setPriorityFilter('All');
                      setCategoryFilter('All');
                      setSearchQuery('');
                    }}>
                    <ThemedText style={styles.clearFilterText}>Reset Filters</ThemedText>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.clearFilterBtn}
                    onPress={() => setIsAddModalVisible(true)}>
                    <ThemedText style={styles.clearFilterText}>Add New Task</ThemedText>
                  </Pressable>
                )}
              </View>
            )
          }
        />

        {/* Modals */}
        <TaskFormModal
          visible={isAddModalVisible || editingTask !== null}
          initialTask={editingTask}
          onClose={() => {
            setIsAddModalVisible(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />

        <ConfirmDeleteModal
          visible={taskToDelete !== null}
          taskTitle={taskToDelete?.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />

        <SettingsModal
          visible={isSettingsModalVisible}
          onClose={() => setIsSettingsModalVisible(false)}
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
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Platform.select({ web: Spacing.two, android: Spacing.three, default: Spacing.two }),
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
    marginTop: Platform.select({ web: Spacing.one, default: Spacing.two }),
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  taskCountText: {
    opacity: 0.65,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsHeaderBtn: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 20,
  },
  addBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  bulkBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  bulkText: {
    color: '#B45309',
    fontWeight: '600',
  },
  clearLink: {
    color: '#DC2626',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(150, 150, 150, 0.3)',
    marginTop: 16,
  },
  emptyIcon: {
    fontSize: 38,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  clearFilterBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
