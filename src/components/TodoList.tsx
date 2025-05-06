
import React, { useMemo } from "react";
import TodoItem from "./TodoItem";
import { FilterType, SortType, TodoItem as TodoItemType } from "../types/todo";
import { useTodoContext } from "../context/TodoContext";
import { Button } from "./ui/button";
import { Filter, ArrowDown, ArrowUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

interface TodoListProps {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}) => {
  const { todos, toggleTodo, deleteTodo, editTodo, clearCompleted, focusSession } = useTodoContext();

  const filteredAndSortedTodos = useMemo(() => {
    // First filter the todos
    const filtered = todos.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });

    // Then sort them
    return filtered.sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "dueDate": {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        default:
          return 0;
      }
    });
  }, [todos, filter, sort]);

  const activeTodosCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Your Tasks</h2>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={(value) => onSortChange(value as SortType)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  {sort === "newest" ? (
                    <ArrowDown className="mr-2 h-4 w-4" />
                  ) : sort === "oldest" ? (
                    <ArrowUp className="mr-2 h-4 w-4" />
                  ) : (
                    <Filter className="mr-2 h-4 w-4" />
                  )}
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(value) => onFilterChange(value as FilterType)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredAndSortedTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-lg font-medium mb-1">No tasks found</h3>
          <p className="text-muted-foreground">
            {filter === "all"
              ? "Add a new task to get started"
              : filter === "active"
              ? "No active tasks - great job!"
              : "No completed tasks yet"}
          </p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              isFocused={focusSession.active && focusSession.taskId === todo.id}
            />
          ))}
        </div>
      )}

      <Separator className="my-6" />

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          <span data-cy="active-count">{activeTodosCount}</span> {activeTodosCount === 1 ? "item" : "items"} left
        </div>
        {todos.some((todo) => todo.completed) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
            className="text-muted-foreground hover:text-destructive"
            data-cy="clear-completed"
          >
            Clear completed
          </Button>
        )}
      </div>
    </div>
  );
};

export default TodoList;
