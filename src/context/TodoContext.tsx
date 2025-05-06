
import React, { createContext, useContext, useEffect, useState } from "react";
import { FilterType, Priority, SortType, TodoItem } from "../types/todo";
import { toast } from "../components/ui/sonner";

interface TodoContextType {
  todos: TodoItem[];
  filter: FilterType;
  sort: SortType;
  addTodo: (text: string, priority: Priority, dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string, priority: Priority, dueDate?: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

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
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    toast.info("Completed tasks cleared");
  };

  const value = {
    todos,
    filter,
    sort,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
    setSort,
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
