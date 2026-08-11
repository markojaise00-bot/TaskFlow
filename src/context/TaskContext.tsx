import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Category,
  CategoryFilter,
  Priority,
  PriorityFilter,
  SortOption,
  StatusFilter,
  Subtask,
  Task,
  TaskStats,
  TaskStatus,
  ThemePreference,
} from '@/types/task';
import {
  exportTasksToJSON,
  importTasksFromJSON,
  loadTasksFromStorage,
  loadThemeFromStorage,
  saveTasksToStorage,
  saveThemeToStorage,
} from '@/services/storage';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  stats: TaskStats;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  categoryFilter: CategoryFilter;
  sortOption: SortOption;
  searchQuery: string;
  themePreference: ThemePreference;
  streakCount: number;
  setStatusFilter: (filter: StatusFilter) => void;
  setPriorityFilter: (filter: PriorityFilter) => void;
  setCategoryFilter: (filter: CategoryFilter) => void;
  setSortOption: (sort: SortOption) => void;
  setSearchQuery: (query: string) => void;
  setThemePreference: (pref: ThemePreference) => void;
  filteredTasks: Task[];
  addTask: (data: {
    title: string;
    description?: string;
    priority: Priority;
    category?: Category;
    dueDate?: string;
    subtasks?: string[];
  }) => Promise<void>;
  editTask: (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>> & { subtasksList?: string[] }
  ) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  bulkCompleteTasks: () => Promise<void>;
  bulkDeleteTasks: (ids: string[]) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (jsonString: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  todayDateFormatted: string;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [themePreference, setThemePrefState] = useState<ThemePreference>('system');

  useEffect(() => {
    let isMounted = true;
    async function initStorage() {
      const storedTasks = await loadTasksFromStorage();
      const storedTheme = await loadThemeFromStorage();
      if (isMounted) {
        setTasks(storedTasks);
        if (storedTheme && ['system', 'light', 'dark'].includes(storedTheme)) {
          setThemePrefState(storedTheme as ThemePreference);
        }
        setIsLoading(false);
      }
    }
    initStorage();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await saveTasksToStorage(newTasks);
  };

  const setThemePreference = async (pref: ThemePreference) => {
    setThemePrefState(pref);
    await saveThemeToStorage(pref);
  };

  const addTask = async (data: {
    title: string;
    description?: string;
    priority: Priority;
    category?: Category;
    dueDate?: string;
    subtasks?: string[];
  }) => {
    const formattedSubtasks: Subtask[] = (data.subtasks || [])
      .filter((s) => s.trim() !== '')
      .map((s, idx) => ({
        id: `st_${Date.now()}_${idx}`,
        title: s.trim(),
        completed: false,
      }));

    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      title: data.title.trim(),
      description: data.description?.trim(),
      priority: data.priority,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      category: data.category || 'Other',
      dueDate: data.dueDate,
      subtasks: formattedSubtasks,
    };
    const updated = [newTask, ...tasks];
    await updateTasks(updated);
  };

  const editTask = async (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>> & { subtasksList?: string[] }
  ) => {
    const updated = tasks.map((task) => {
      if (task.id === id) {
        let subtasks = task.subtasks || [];
        if (updates.subtasksList !== undefined) {
          subtasks = updates.subtasksList
            .filter((s) => s.trim() !== '')
            .map((s, idx) => {
              const existing = (task.subtasks || []).find((e) => e.title === s.trim());
              return existing || { id: `st_${Date.now()}_${idx}`, title: s.trim(), completed: false };
            });
        }
        return {
          ...task,
          ...updates,
          title: updates.title !== undefined ? updates.title.trim() : task.title,
          description: updates.description !== undefined ? updates.description?.trim() : task.description,
          subtasks,
        };
      }
      return task;
    });
    await updateTasks(updated);
  };

  const toggleTaskStatus = async (id: string) => {
    const updated = tasks.map((task) => {
      if (task.id === id) {
        const nextStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        // Auto-toggle subtasks if task is completed
        const updatedSubtasks = (task.subtasks || []).map((s) => ({
          ...s,
          completed: nextStatus === 'Completed' ? true : s.completed,
        }));
        return { ...task, status: nextStatus, subtasks: updatedSubtasks };
      }
      return task;
    });
    await updateTasks(updated);
  };

  const deleteTask = async (id: string) => {
    const updated = tasks.filter((task) => task.id !== id);
    await updateTasks(updated);
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubtasks = (task.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        // Auto-complete task if all subtasks are finished
        const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
        return {
          ...task,
          subtasks: updatedSubtasks,
          status: allDone ? 'Completed' : task.status,
        };
      }
      return task;
    });
    await updateTasks(updated);
  };

  const addSubtask = async (taskId: string, title: string) => {
    if (!title.trim()) return;
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        const newSubtask: Subtask = {
          id: `st_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          title: title.trim(),
          completed: false,
        };
        return { ...task, subtasks: [...(task.subtasks || []), newSubtask] };
      }
      return task;
    });
    await updateTasks(updated);
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: (task.subtasks || []).filter((st) => st.id !== subtaskId),
        };
      }
      return task;
    });
    await updateTasks(updated);
  };

  const bulkCompleteTasks = async () => {
    const updated = tasks.map((task) => ({ ...task, status: 'Completed' as TaskStatus }));
    await updateTasks(updated);
  };

  const bulkDeleteTasks = async (ids: string[]) => {
    const updated = tasks.filter((t) => !ids.includes(t.id));
    await updateTasks(updated);
  };

  const clearCompletedTasks = async () => {
    const updated = tasks.filter((t) => t.status !== 'Completed');
    await updateTasks(updated);
  };

  const exportJSON = (): string => {
    return exportTasksToJSON(tasks);
  };

  const importJSON = async (jsonString: string) => {
    const imported = await importTasksFromJSON(jsonString);
    setTasks(imported);
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((t) => t.id === id);
  };

  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = total - completed;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionPercentage,
    };
  }, [tasks]);

  const streakCount = useMemo(() => {
    const completedCount = tasks.filter((t) => t.status === 'Completed').length;
    return Math.max(1, Math.min(30, completedCount));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      // Filter by status
      if (statusFilter === 'Pending' && task.status !== 'Pending') return false;
      if (statusFilter === 'Completed' && task.status !== 'Completed') return false;

      // Filter by priority
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;

      // Filter by category
      if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(q);
        const inDesc = task.description?.toLowerCase().includes(q) ?? false;
        const inCategory = task.category?.toLowerCase().includes(q) ?? false;
        if (!inTitle && !inDesc && !inCategory) return false;
      }

      return true;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortOption === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortOption === 'priority') {
        const pMap: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      // Default: createdAt descending (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, sortOption, searchQuery]);

  const todayDateFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        stats,
        statusFilter,
        priorityFilter,
        categoryFilter,
        sortOption,
        searchQuery,
        themePreference,
        streakCount,
        setStatusFilter,
        setPriorityFilter,
        setCategoryFilter,
        setSortOption,
        setSearchQuery,
        setThemePreference,
        filteredTasks,
        addTask,
        editTask,
        toggleTaskStatus,
        deleteTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        bulkCompleteTasks,
        bulkDeleteTasks,
        clearCompletedTasks,
        exportJSON,
        importJSON,
        getTaskById,
        todayDateFormatted,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
