
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
