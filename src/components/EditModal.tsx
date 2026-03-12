'use client';

import { useState, FormEvent, useEffect } from 'react';
import type { Todo } from './TodoApp';

interface EditModalProps {
  todo: Todo;
  onSave: (id: string, title: string, description: string) => Promise<void>;
  onCancel: () => void;
}

export default function EditModal({ todo, onSave, onCancel }: EditModalProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description || '');
  }, [todo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(todo.id, title.trim(), description.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>✏️ Edit Todo</h2>
          <button onClick={onCancel} style={styles.closeButton} title="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {validationError && (
            <p style={styles.validationError}>⚠️ {validationError}</p>
          )}
          <div style={styles.fieldGroup}>
            <label htmlFor="edit-title" style={styles.label}>
              Title <span style={styles.required}>*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Todo title"
              style={{
                ...styles.input,
                ...(validationError ? styles.inputError : {}),
              }}
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div style={styles.fieldGroup}>
            <label htmlFor="edit-description" style={styles.label}>
              Description <span style={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={4}
              style={styles.textarea}
              disabled={isSubmitting}
            />
          </div>
          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '28px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  closeButton: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#6b7280',
  },
  validationError: {
    color: '#dc2626',
    fontSize: '0.85rem',
    marginBottom: '12px',
    padding: '8px 12px',
    backgroundColor: '#fee2e2',
    borderRadius: '6px',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  required: {
    color: '#dc2626',
  },
  optional: {
    color: '#9ca3af',
    fontWeight: '400',
    fontSize: '0.8rem',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    outline: 'none',
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fff5f5',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    backgroundColor: '#f9fafb',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    flex: 1,
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveButton: {
    flex: 2,
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
