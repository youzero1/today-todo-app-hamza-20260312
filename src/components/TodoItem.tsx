'use client';

import { useState } from 'react';
import type { Todo } from './TodoApp';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggleComplete(todo.id, todo.completed);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    setIsDeleting(true);
    await onDelete(todo.id);
    setIsDeleting(false);
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        ...styles.card,
        ...(todo.completed ? styles.cardCompleted : {}),
        ...(isDeleting ? styles.cardDeleting : {}),
      }}
    >
      <div style={styles.cardContent}>
        <div style={styles.checkboxArea}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            disabled={isToggling || isDeleting}
            style={styles.checkbox}
            id={`todo-${todo.id}`}
          />
        </div>
        <div style={styles.textArea}>
          <label
            htmlFor={`todo-${todo.id}`}
            style={{
              ...styles.title,
              ...(todo.completed ? styles.titleCompleted : {}),
            }}
          >
            {todo.title}
          </label>
          {todo.description && (
            <p
              style={{
                ...styles.description,
                ...(todo.completed ? styles.descriptionCompleted : {}),
              }}
            >
              {todo.description}
            </p>
          )}
          <span style={styles.date}>{formattedDate}</span>
        </div>
        <div style={styles.actions}>
          <button
            onClick={() => onEdit(todo)}
            style={styles.editButton}
            disabled={isDeleting}
            title="Edit todo"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            style={styles.deleteButton}
            disabled={isDeleting}
            title="Delete todo"
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
      {todo.completed && (
        <div style={styles.completedBadge}>✓ Completed</div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderLeft: '4px solid #6366f1',
    transition: 'opacity 0.2s, transform 0.2s',
    position: 'relative',
  },
  cardCompleted: {
    borderLeft: '4px solid #10b981',
    backgroundColor: '#f9fffe',
  },
  cardDeleting: {
    opacity: 0.5,
    transform: 'scale(0.98)',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  checkboxArea: {
    paddingTop: '3px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#6366f1',
    flexShrink: 0,
  },
  textArea: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a2e',
    cursor: 'pointer',
    marginBottom: '4px',
    wordBreak: 'break-word',
  },
  titleCompleted: {
    textDecoration: 'line-through',
    color: '#9ca3af',
  },
  description: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '6px',
    wordBreak: 'break-word',
    lineHeight: '1.5',
  },
  descriptionCompleted: {
    textDecoration: 'line-through',
    color: '#d1d5db',
  },
  date: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  editButton: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    color: '#374151',
  },
  deleteButton: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    color: '#374151',
  },
  completedBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    fontSize: '0.7rem',
    color: '#10b981',
    fontWeight: '600',
    backgroundColor: '#d1fae5',
    padding: '2px 8px',
    borderRadius: '20px',
  },
};
