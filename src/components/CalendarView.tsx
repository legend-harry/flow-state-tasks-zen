
import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { TodoItem } from "@/types/todo";
import { format, startOfDay, isEqual, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  todos: TodoItem[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ todos }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Create a map of dates to todo items
  const calendarEntries = useMemo(() => {
    const entries: Record<string, TodoItem[]> = {};
    
    todos.forEach(todo => {
      if (todo.dueDate) {
        const dateKey = format(new Date(todo.dueDate), 'yyyy-MM-dd');
        
        if (!entries[dateKey]) {
          entries[dateKey] = [];
        }
        
        entries[dateKey].push(todo);
      }
    });
    
    return entries;
  }, [todos]);

  // Get tasks for the selected date
  const selectedDateTasks = useMemo(() => {
    return todos.filter(todo => 
      todo.dueDate && isSameDay(new Date(todo.dueDate), selectedDate)
    );
  }, [todos, selectedDate]);

  // Custom day render function for the calendar component
  const renderDay = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const tasksForDate = calendarEntries[dateKey] || [];
    
    // Get counts by priority
    const highPriorityCount = tasksForDate.filter(t => t.priority === "high").length;
    const mediumPriorityCount = tasksForDate.filter(t => t.priority === "medium").length;
    const lowPriorityCount = tasksForDate.filter(t => t.priority === "low").length;
    
    // If there are tasks on this day, show indicators
    if (tasksForDate.length > 0) {
      return (
        <div className="relative w-full h-full">
          <div className="absolute w-full justify-center flex -bottom-1">
            {highPriorityCount > 0 && (
              <div className="h-1.5 w-1.5 rounded-full bg-todo-high-priority mx-0.5" />
            )}
            {mediumPriorityCount > 0 && (
              <div className="h-1.5 w-1.5 rounded-full bg-todo-medium-priority mx-0.5" />
            )}
            {lowPriorityCount > 0 && (
              <div className="h-1.5 w-1.5 rounded-full bg-todo-low-priority mx-0.5" />
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-300";
      case "low": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default: return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="calendar-view-container">
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
        <Card className="shadow-md border border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="pointer-events-auto"
              components={{
                DayContent: (props) => (
                  <>
                    <span>{format(props.date, 'd')}</span>
                    {renderDay(props.date)}
                  </>
                )
              }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            <ScrollArea className="h-[400px] pr-4">
              {selectedDateTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-lg font-medium mb-1">No tasks scheduled</h3>
                  <p className="text-muted-foreground">
                    Add tasks with due dates to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateTasks.map((task) => (
                    <Card key={task.id} className={cn(
                      "p-3 border-l-4",
                      task.completed ? "opacity-60 border-gray-300" : `border-l-4 ${
                        task.priority === "high" ? "border-todo-high-priority" :
                        task.priority === "medium" ? "border-todo-medium-priority" : 
                        "border-todo-low-priority"
                      }`
                    )}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                              {task.text}
                            </span>
                            <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
