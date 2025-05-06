
import React from "react";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import { TodoProvider, useTodoContext } from "@/context/TodoContext";

const TodoApp = () => {
  const { addTodo, filter, sort, setFilter, setSort } = useTodoContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900 py-12 px-4">
      <div className="todo-container">
        <AddTodoForm onAdd={addTodo} />
        
        <TodoList 
          filter={filter} 
          sort={sort} 
          onFilterChange={setFilter} 
          onSortChange={setSort} 
        />
      </div>
      
      <footer className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
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
