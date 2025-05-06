
import React, { useState } from "react";
import { TodoItem as TodoItemType, Priority } from "../types/todo";
import { Check, Pencil, Trash2, Calendar, Star, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { useTodoContext } from "@/context/TodoContext";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, priority: Priority, dueDate?: string) => void;
  isFocused?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit, isFocused = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [editedPriority, setEditedPriority] = useState<Priority>(todo.priority);
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );

  const { startFocusSession } = useTodoContext();

  const handleSave = () => {
    onEdit(
      todo.id,
      editedText,
      editedPriority,
      editedDueDate ? format(editedDueDate, "yyyy-MM-dd") : undefined
    );
    setIsEditing(false);
  };

  const openEditDialog = () => {
    setEditedText(todo.text);
    setEditedPriority(todo.priority);
    setEditedDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
    setIsEditing(true);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case "high":
        return <Star className="h-4 w-4 text-red-500 fill-red-500" />;
      case "medium":
        return <Star className="h-4 w-4 text-amber-500 fill-amber-500" />;
      case "low":
        return <Star className="h-4 w-4 text-green-500" />;
    }
  };

  const handleStartFocus = () => {
    startFocusSession(todo.id);
  };

  return (
    <div
      className={`task-item p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm transition-all ${
        todo.completed ? "completed" : ""
      } ${isFocused ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900" : ""} animate-fade-in`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`task-checkbox flex-shrink-0 h-6 w-6 border-2 border-primary rounded-full flex items-center justify-center cursor-pointer ${
            todo.completed ? "checked" : ""
          }`}
          onClick={() => onToggle(todo.id)}
        >
          {todo.completed && (
            <Check className="h-4 w-4 text-white animate-check-mark" />
          )}
        </div>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <p className={`task-text text-base ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
              {todo.text}
            </p>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className={`priority-badge flex items-center gap-1 ${getPriorityColor(todo.priority)}`}>
                {getPriorityIcon(todo.priority)}
                <span className="hidden sm:inline">{todo.priority}</span>
              </span>

              {todo.dueDate && (
                <span className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(todo.dueDate), "MMM d")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {!todo.completed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              onClick={handleStartFocus}
            >
              <Clock className="h-4 w-4" />
              <span className="sr-only">Focus</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            onClick={openEditDialog}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task">Task Description</Label>
              <Input
                id="task"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Enter task description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={editedPriority}
                onValueChange={(value) => setEditedPriority(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editedDueDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editedDueDate ? (
                      format(editedDueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editedDueDate}
                    onSelect={setEditedDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {editedDueDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setEditedDueDate(undefined)}
                >
                  Clear date
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!editedText.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoItem;
