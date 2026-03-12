'use client';

import TodoItem from './TodoItem';
import type { Todo } from './TodoApp';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
}

export default function TodoList({
  todos,
  onToggleComplete,
  onDelete,
  onEdit,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📋</div>
        <h3 style={styles.emptyTitle}>No todos yet!</h3>
        <p style={styles.emptyText}>
          Add your first todo above to get started.
        </p>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div>
      <div style={styles.statsBar}>
        <span style={styles.statsText}>
          {completedCount} / {totalCount} completed
        </span>
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
      <div style={styles.list}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  emptyContainer: {
    textAlign: 'center',
    padding: '64px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    padding: '0 4px',
  },
  statsText: {
    fontSize: '0.85rem',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    minWidth: '100px',
  },
  progressBarContainer: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};
