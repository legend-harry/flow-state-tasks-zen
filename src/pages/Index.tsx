
import React from "react";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import FocusMode from "@/components/FocusMode";
import { TodoProvider, useTodoContext } from "@/context/TodoContext";
import { Clock, Pencil, Book } from "lucide-react";

const FloatingIcons = () => (
  <div className="floating-icons fixed inset-0 pointer-events-none overflow-hidden z-0">
    <Clock className="floating-icon absolute top-20 right-[15%] text-indigo-200 dark:text-indigo-900/30 w-24 h-24 animate-float" />
    <Pencil className="floating-icon absolute bottom-[10%] left-[10%] text-purple-200 dark:text-purple-900/30 w-16 h-16 rotate-12 animate-float-delay" />
    <Book className="floating-icon absolute top-[30%] left-[5%] text-pink-200 dark:text-pink-900/30 w-20 h-20 -rotate-6 animate-float-alt" />
  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900 py-12 px-4 relative overflow-hidden">
      <FloatingIcons />
      
      <div className="todo-container relative z-10">
        {focusSession.active && focusedTask ? (
          <FocusMode 
            task={focusedTask} 
            onClose={endFocusSession} 
            onComplete={handleCompleteTask} 
          />
        ) : (
          <>
            <AddTodoForm onAdd={addTodo} />
            
            <TodoList 
              filter={filter} 
              sort={sort} 
              onFilterChange={setFilter} 
              onSortChange={setSort} 
            />
          </>
        )}
      </div>
      
      <footer className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 relative z-10">
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
