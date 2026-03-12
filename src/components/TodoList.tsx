'use client';

import { useState, useEffect, useCallback } from 'react';
import AddTodoForm from './AddTodoForm';
import TodoItem, { TodoData } from './TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTodos(data);
    } catch {
      setError('Failed to load todos. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (title: string, description?: string) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) throw new Error('Failed to create');
    const newTodo = await res.json();
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Failed to update');
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdate = async (id: number, title: string, description?: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: description || null }),
    });
    if (!res.ok) throw new Error('Failed to update');
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeTodoCount = todos.filter((t) => !t.completed).length;
  const completedTodoCount = todos.filter((t) => t.completed).length;

  return (
    <div>
      <AddTodoForm onAdd={handleAdd} />

      {/* Stats */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">{activeTodoCount}</span> remaining
            {completedTodoCount > 0 && (
              <span> · <span className="font-medium text-slate-700">{completedTodoCount}</span> completed</span>
            )}
          </p>
          <div className="flex gap-1">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Todo List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-400 text-sm">Loading todos...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchTodos}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">
            {filter === 'completed' ? '✅' : filter === 'active' ? '🎯' : '📝'}
          </div>
          <p className="text-slate-400 text-lg font-medium">
            {filter === 'completed'
              ? 'No completed todos yet'
              : filter === 'active'
              ? 'No active todos'
              : 'No todos yet'}
          </p>
          {filter === 'all' && (
            <p className="text-slate-400 text-sm mt-1">Add your first todo above to get started!</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Clear completed */}
      {completedTodoCount > 0 && filter !== 'active' && (
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              const completedTodos = todos.filter((t) => t.completed);
              await Promise.all(completedTodos.map((t) => handleDelete(t.id)));
            }}
            className="text-sm text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear all completed ({completedTodoCount})
          </button>
        </div>
      )}
    </div>
  );
}
