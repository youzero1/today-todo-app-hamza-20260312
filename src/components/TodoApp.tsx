'use client';

import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import EditModal from './EditModal';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.statusText}`);
      }
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (title: string, description: string) => {
    try {
      setError(null);
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create todo');
      }
      const newTodo: Todo = await response.json();
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      setError(null);
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodo: Todo = await response.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleSaveEdit = async (id: string, title: string, description: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update todo');
      }
      const updatedTodo: Todo = await response.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      setEditingTodo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <h1 style={styles.title}>📝 Todo App</h1>
          <p style={styles.subtitle}>Stay organized and get things done</p>
        </header>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} style={styles.errorClose}>
              ✕
            </button>
          </div>
        )}

        <TodoForm onAddTodo={handleAddTodo} />

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading todos...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
          />
        )}
      </div>

      {editingTodo && (
        <EditModal
          todo={editingTodo}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '24px 16px',
  },
  wrapper: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#991b1b',
    fontSize: '0.9rem',
  },
  errorClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#991b1b',
    fontSize: '1rem',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 0',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '1rem',
  },
};
