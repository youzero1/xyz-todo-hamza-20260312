'use client';

import { useState } from 'react';

interface AddTodoFormProps {
  onAdd: (title: string, description?: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onAdd(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch {
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Add New Todo</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            onFocus={() => setIsExpanded(true)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-slate-400 text-slate-700 transition-all"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {isExpanded && (
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-slate-400 text-slate-700 transition-all resize-none"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="flex gap-2 justify-end">
          {isExpanded && (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setDescription('');
                setError('');
              }}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add Todo'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
