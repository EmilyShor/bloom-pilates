import { useEffect, useRef, useState } from 'react';
import { Flower2, Trash2, X } from 'lucide-react';
import {
  CLASS_TYPES,
  LEVELS,
  hasConflict,
  validateSession,
} from '../lib/schedule.js';

export default function SessionForm({
  session,
  date,
  sessions,
  onSave,
  onDelete,
  onClose,
}) {
  const dialog = useRef(null);
  const [form, setForm] = useState(
    session ?? {
      title: '',
      date,
      time: '09:00',
      duration: 50,
      type: 'Reformer',
      level: 'All levels',
      capacity: 8,
      booked: 0,
      notes: '',
    },
  );
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError('');
    setConfirmDelete(false);
  }

  function submit(event) {
    event.preventDefault();
    const next = {
      ...form,
      title: form.title.trim(),
      duration: Number(form.duration),
      capacity: Number(form.capacity),
      booked: Number(form.booked),
    };
    const message = validateSession(next);
    if (message) return setError(message);
    if (hasConflict(next, sessions))
      return setError(
        'You already have a class at this time. Choose another time.',
      );
    onSave({ ...next, id: session?.id ?? crypto.randomUUID() });
  }

  return (
    <dialog
      ref={dialog}
      className="session-dialog"
      aria-labelledby="form-heading"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="dialog-header">
        <span className="dialog-flower">
          <Flower2 size={25} strokeWidth={1.5} />
        </span>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <p className="eyebrow">A LITTLE SPACE FOR MOVEMENT</p>
      <h2 id="form-heading">
        {session ? 'Edit your class' : 'Plan something good.'}
      </h2>
      <p className="muted form-intro">
        {session
          ? 'Fine-tune the details of your session.'
          : 'Add a new session to your studio schedule.'}
      </p>
      <form onSubmit={submit}>
        <label>
          Class name
          <input
            autoFocus
            name="title"
            value={form.title}
            onChange={update}
            placeholder="e.g. Morning flow"
            maxLength={70}
            required
          />
        </label>
        <div className="form-grid">
          <label>
            Class type
            <select name="type" value={form.type} onChange={update}>
              {CLASS_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Level
            <select name="level" value={form.level} onChange={update}>
              {LEVELS.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={update}
              required
            />
          </label>
          <label>
            Start time
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={update}
              required
            />
          </label>
          <label>
            Duration (minutes)
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={update}
              min="15"
              max="180"
              required
            />
          </label>
          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={update}
              min="1"
              max="100"
              required
            />
          </label>
        </div>
        <label>
          Booked spots
          <input
            type="number"
            name="booked"
            value={form.booked}
            onChange={update}
            min="0"
            max="100"
            required
          />
        </label>
        <label>
          Notes <span className="optional">optional</span>
          <textarea
            name="notes"
            value={form.notes}
            onChange={update}
            placeholder="Equipment, focus, or a little reminder…"
            rows="2"
            maxLength={500}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {confirmDelete && (
          <p className="delete-confirm" role="alert">
            Remove this class from your schedule?{' '}
            <button type="button" onClick={() => onDelete(session.id)}>
              Yes, remove class
            </button>
          </p>
        )}
        <div className="form-actions">
          {session && (
            <button
              type="button"
              className="delete-button"
              aria-label="Delete class"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={17} />
            </button>
          )}
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary">
            {session ? 'Save changes' : 'Add to schedule'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
