import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

const TASKS_STORAGE_KEY = '@taskflow_tasks_v2';
const THEME_STORAGE_KEY = '@taskflow_theme_v1';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design TaskFlow Wireframes',
    description: 'Sketch initial mobile screen layouts and review color scheme',
    priority: 'High',
    status: 'Completed',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    category: 'Work',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'st1', title: 'Sketch dashboard layout', completed: true },
      { id: 'st2', title: 'Define color tokens', completed: true },
    ],
  },
  {
    id: '2',
    title: 'Setup Local Storage & State',
    description: 'Implement TaskContext and AsyncStorage for offline persistence',
    priority: 'High',
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [
      { id: 'st3', title: 'Create TaskProvider', completed: true },
      { id: 'st4', title: 'Add AsyncStorage adapter', completed: true },
    ],
  },
  {
    id: '3',
    title: 'Build Dashboard & Analytics',
    description: 'Add metrics display, progress bar, and weekly completion trends',
    priority: 'Medium',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    category: 'Personal',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'st5', title: 'Design metrics card', completed: true },
      { id: 'st6', title: 'Add streak counter', completed: false },
    ],
  },
  {
    id: '4',
    title: 'Grocery & Supplies Shopping',
    description: 'Buy fresh produce, milk, coffee beans, and household essentials',
    priority: 'Low',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    category: 'Shopping',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'st7', title: 'Organic milk & eggs', completed: false },
      { id: 'st8', title: 'Dark roast coffee', completed: false },
    ],
  },
];

export const loadTasksFromStorage = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (jsonValue != null) {
      const parsed: Task[] = JSON.parse(jsonValue);
      // Migration: ensure subtasks array exists on loaded tasks
      return parsed.map((task) => ({
        ...task,
        subtasks: task.subtasks || [],
        category: task.category || 'Other',
      }));
    }
    // Seed initial tasks on first launch
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  } catch (error) {
    console.error('Failed to load tasks from storage:', error);
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Failed to save tasks to storage:', error);
  }
};

export const exportTasksToJSON = (tasks: Task[]): string => {
  return JSON.stringify(tasks, null, 2);
};

export const importTasksFromJSON = async (jsonString: string): Promise<Task[]> => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid backup file structure: expected array of tasks.');
    }
    const validated: Task[] = parsed.map((t, idx) => ({
      id: t.id || `imported_${Date.now()}_${idx}`,
      title: t.title || 'Untitled Task',
      description: t.description || '',
      priority: t.priority || 'Medium',
      status: t.status || 'Pending',
      createdAt: t.createdAt || new Date().toISOString(),
      dueDate: t.dueDate,
      category: t.category || 'Other',
      subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
    }));
    await saveTasksToStorage(validated);
    return validated;
  } catch (e) {
    console.error('Error importing tasks JSON:', e);
    throw e;
  }
};

export const loadThemeFromStorage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(THEME_STORAGE_KEY);
  } catch (e) {
    return null;
  }
};

export const saveThemeToStorage = async (theme: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme preference:', e);
  }
};
