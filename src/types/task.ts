export type Priority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'Pending' | 'Completed';

export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Finance' | 'Other';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string; // ISO string format
  dueDate?: string; // YYYY-MM-DD or ISO string format
  category?: Category;
  subtasks?: Subtask[];
}

export type StatusFilter = 'All' | 'Pending' | 'Completed';
export type PriorityFilter = 'All' | 'Low' | 'Medium' | 'High';
export type CategoryFilter = 'All' | Category;
export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'alphabetical';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionPercentage: number;
}
