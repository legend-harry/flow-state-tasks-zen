import React, { createContext, useContext, useEffect, useState } from "react";
import { FilterType, FocusSession, Priority, SortType, TodoItem } from "../types/todo";
import { toast } from "../components/ui/sonner";

interface TodoContextType {
  todos: TodoItem[];
  filter: FilterType;
  sort: SortType;
  focusSession: FocusSession;
  addTodo: (text: string, priority: Priority, dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string, priority: Priority, dueDate?: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  startFocusSession: (taskId: string, focusDuration?: number, breakDuration?: number) => void;
  endFocusSession: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [focusSession, setFocusSession] = useState<FocusSession>({
    active: false,
    taskId: null,
    mode: "focus",
    duration: 25 * 60,
    timeLeft: 25 * 60,
    focusDuration: 25,
    breakDuration: 5
  });

  useEffect(() => {
    // Load todos from localStorage on initial render
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever todos change
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Priority, dueDate?: string) => {
    if (!text.trim()) return;

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate,
    };

    setTodos((prev) => [newTodo, ...prev]);
    toast.success("Task added successfully!");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    // If the task is in focus mode, end the focus session
    if (focusSession.active && focusSession.taskId === id) {
      endFocusSession();
    }
    
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.info("Task deleted");
  };

  const editTodo = (id: string, text: string, priority: Priority, dueDate?: string) => {
    if (!text.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text, priority, dueDate }
          : todo
      )
    );
    toast.success("Task updated");
  };

  const clearCompleted = () => {
    // If a completed task is in focus mode, end the focus session
    const completedTodos = todos.filter(todo => todo.completed);
    const inFocusAndCompleted = completedTodos.some(todo => todo.id === focusSession.taskId);
    
    if (inFocusAndCompleted) {
      endFocusSession();
    }
    
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    toast.info("Completed tasks cleared");
  };
  
  const startFocusSession = (taskId: string, focusDuration = 25, breakDuration = 5) => {
    setFocusSession({
      active: true,
      taskId,
      mode: "focus",
      duration: focusDuration * 60, // Convert to seconds
      timeLeft: focusDuration * 60,
      focusDuration,
      breakDuration
    });
    toast.success("Focus session started!");
  };
  
  const endFocusSession = () => {
    setFocusSession({
      active: false,
      taskId: null,
      mode: "focus",
      duration: (focusSession.focusDuration || 25) * 60,
      timeLeft: (focusSession.focusDuration || 25) * 60,
      focusDuration: focusSession.focusDuration,
      breakDuration: focusSession.breakDuration
    });
  };

  const value = {
    todos,
    filter,
    sort,
    focusSession,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
    setSort,
    startFocusSession,
    endFocusSession,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
