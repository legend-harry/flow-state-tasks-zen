
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Calendar } from "lucide-react";
import { Priority } from "../types/todo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddTodoFormProps {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState<Date>();
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text, priority, date ? format(date, "yyyy-MM-dd") : undefined);
      setText("");
      setPriority("medium");
      setDate(undefined);
    }
  };

  return (
    <div className="add-task-container">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
        Flow State Tasks
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`flex flex-col gap-4 ${isMobile ? 'space-y-2' : 'sm:flex-row'}`}>
          <Input
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow shadow-sm"
            data-cy="add-todo-input"
          />
          <div className={`flex ${isMobile ? 'flex-wrap justify-between' : 'gap-2'}`}>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
            >
              <SelectTrigger className={`${isMobile ? 'w-[48%] mb-2' : 'w-32'}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`${isMobile ? 'w-[48%] mb-2' : 'w-[130px]'}`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PP") : "Due Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button 
              type="submit" 
              className={`bg-todo-purple hover:bg-todo-deep-purple ${isMobile ? 'w-full mt-1' : ''}`}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
        {date && (
          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDate(undefined)}
            >
              Clear due date
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTodoForm;
