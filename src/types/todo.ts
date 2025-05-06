
export type Priority = "low" | "medium" | "high";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
  dueDate?: string;
}

export type FilterType = "all" | "active" | "completed";

export type SortType = "newest" | "oldest" | "priority" | "dueDate";

export interface FocusSession {
  active: boolean;
  taskId: string | null;
  mode: "focus" | "break";
  duration: number;
  timeLeft: number;
  focusDuration?: number; // Added to store user's preferred focus duration
  breakDuration?: number; // Added to store user's preferred break duration
}
