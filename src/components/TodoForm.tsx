'use client';

import { useState, FormEvent } from 'react';

interface TodoFormProps {
  onAddTodo: (title: string, description: string) => Promise<void>;
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTodo(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.formTitle}>Add New Todo</h2>
      {validationError && (
        <p style={styles.validationError}>⚠️ {validationError}</p>
      )}
      <div style={styles.fieldGroup}>
        <label htmlFor="title" style={styles.label}>
          Title <span style={styles.required}>*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder="What needs to be done?"
          style={{
            ...styles.input,
            ...(validationError ? styles.inputError : {}),
          }}
          disabled={isSubmitting}
        />
      </div>
      <div style={styles.fieldGroup}>
        <label htmlFor="description" style={styles.label}>
          Description <span style={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          style={styles.textarea}
          disabled={isSubmitting}
        />
      </div>
      <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? '⏳ Adding...' : '+ Add Todo'}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  formTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '16px',
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
    transition: 'border-color 0.2s',
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
  submitButton: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  },
};
