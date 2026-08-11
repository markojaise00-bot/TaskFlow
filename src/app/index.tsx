import { AnalyticsCard } from '@/components/AnalyticsCard';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { DashboardStatsCard } from '@/components/DashboardStatsCard';
import { SettingsModal } from '@/components/SettingsModal';
import { TaskCard } from '@/components/TaskCard';
import { TaskFormModal } from '@/components/TaskFormModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const {
    tasks,
    isLoading,
    addTask,
    editTask,
    toggleTaskStatus,
    deleteTask,
    todayDateFormatted,
  } = useTasks();
  const router = useRouter();

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

  const recentTasks = tasks.slice(0, 5);
  const isWeb = Platform.OS === 'web';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={recentTasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  {!isWeb && <ThemedText style={styles.brandTitle}>TaskFlow</ThemedText>}
                  <ThemedText style={styles.todayDate} type="small">
                    Tasks for Jaise
                  </ThemedText>
                </View>

                <View style={styles.headerActions}>
                  <Pressable
                    hitSlop={8}
                    style={styles.settingsHeaderBtn}
                    onPress={() => setIsSettingsModalVisible(true)}>
                    <ThemedText style={styles.settingsIcon}>⚙️</ThemedText>
                  </Pressable>

                  <Pressable
                    style={styles.addTaskHeaderBtn}
                    onPress={() => setIsAddModalVisible(true)}>
                    <ThemedText style={styles.addTaskHeaderBtnText}>+ Add Task</ThemedText>
                  </Pressable>
                </View>
              </View>

              {/* Dashboard Metrics */}
              <DashboardStatsCard />

              {/* Analytics & Streak Tracker */}
              <AnalyticsCard />

              {/* Recent Tasks Title Row */}
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle} type="subtitle">
                  Recent Tasks
                </ThemedText>
                {tasks.length > 0 && (
                  <Pressable onPress={() => router.push('/explore')}>
                    <ThemedText style={styles.viewAllText}>View All ({tasks.length}) →</ThemedText>
                  </Pressable>
                )}
              </View>
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
                <ThemedText style={styles.emptyIcon}>📝</ThemedText>
                <ThemedText style={styles.emptyTitle}>No tasks yet</ThemedText>
                <ThemedText style={styles.emptySubtitle} type="small">
                  Tap "+ Add Task" to create your first task and stay organized.
                </ThemedText>
                <Pressable
                  style={styles.emptyActionBtn}
                  onPress={() => setIsAddModalVisible(true)}>
                  <ThemedText style={styles.emptyActionText}>Create First Task</ThemedText>
                </Pressable>
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
    marginBottom: Spacing.one,
    marginTop: Platform.select({ web: Spacing.one, default: Spacing.two }),
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  todayDate: {
    opacity: 0.65,
    marginTop: 2,
    fontWeight: '600',
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
  addTaskHeaderBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addTaskHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
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
    marginTop: 8,
  },
  emptyIcon: {
    fontSize: 40,
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
  emptyActionBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
