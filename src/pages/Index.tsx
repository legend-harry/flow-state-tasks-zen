
import React, { useState } from "react";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import CalendarView from "@/components/CalendarView";
import FocusMode from "@/components/FocusMode";
import { TodoProvider, useTodoContext } from "@/context/TodoContext";
import { Clock, Pencil, Book } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const FloatingIcons = () => (
  <div className="floating-icons fixed inset-0 pointer-events-none overflow-hidden z-0">
    <Clock className="floating-icon absolute top-20 right-[15%] text-indigo-200 dark:text-indigo-900/30 w-24 h-24 animate-float" />
    <Pencil className="floating-icon absolute bottom-[10%] left-[10%] text-purple-200 dark:text-purple-900/30 w-16 h-16 rotate-12 animate-float-delay" />
    <Book className="floating-icon absolute top-[30%] left-[5%] text-pink-200 dark:text-pink-900/30 w-20 h-20 -rotate-6 animate-float-alt" />
  </div>
);

const BackgroundShapes = () => (
  <>
    <div className="bg-shape bg-shape-1"></div>
    <div className="bg-shape bg-shape-2"></div>
    <div className="bg-shape bg-shape-3"></div>
  </>
);

const TodoApp = () => {
  const { 
    addTodo, 
    filter, 
    sort, 
    setFilter, 
    setSort,
    focusSession,
    todos,
    toggleTodo,
    endFocusSession
  } = useTodoContext();
  
  const [activeTab, setActiveTab] = useState<string>("list");
  
  const focusedTask = focusSession.active && focusSession.taskId 
    ? todos.find(todo => todo.id === focusSession.taskId) 
    : null;

  const handleCompleteTask = () => {
    if (focusSession.taskId) {
      toggleTodo(focusSession.taskId);
      endFocusSession();
    }
  };

  return (
    <div className="min-h-screen dynamic-gradient-bg py-12 px-4 relative overflow-hidden">
      <BackgroundShapes />
      <FloatingIcons />
      
      <div className="todo-container relative z-10 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
        {focusSession.active && focusedTask ? (
          <FocusMode 
            task={focusedTask} 
            onClose={endFocusSession} 
            onComplete={handleCompleteTask} 
          />
        ) : (
          <>
            <AddTodoForm onAdd={addTodo} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid grid-cols-2 w-[300px] mx-auto mb-6 enhanced-btn">
                <TabsTrigger value="list" className="interactive-element">List View</TabsTrigger>
                <TabsTrigger value="calendar" className="interactive-element">Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <TodoList 
                  filter={filter} 
                  sort={sort} 
                  onFilterChange={setFilter} 
                  onSortChange={setSort} 
                />
              </TabsContent>
              
              <TabsContent value="calendar">
                <CalendarView todos={todos} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      <footer className="mt-8 text-center text-sm text-white dark:text-slate-400 relative z-10 backdrop-blur-sm bg-white/10 py-2 rounded-full mx-auto max-w-xs">
        <p>Flow State Tasks - Stay focused and productive</p>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

export default Index;
