import { useEffect, useState } from 'react';
import { createDemoSessions } from '../data/demoSessions.js';
import { isStoredSession, STORAGE_KEY } from '../lib/schedule.js';

function readSessions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return { sessions: createDemoSessions(), error: '' };
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(isStoredSession))
      throw new Error('Invalid saved schedule');
    return { sessions: parsed, error: '' };
  } catch {
    return {
      sessions: [],
      error:
        'Your saved schedule could not be read. Changes will only be kept for this visit.',
    };
  }
}

export function useSessions() {
  const [initial] = useState(readSessions);
  const [sessions, setSessions] = useState(initial.sessions);
  const [storageError, setStorageError] = useState(initial.error);

  useEffect(() => {
    // Preserve unreadable data rather than silently replacing it with demo content.
    if (initial.error) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      setStorageError('');
    } catch {
      setStorageError(
        'Your browser could not save this schedule. Changes will only be kept for this visit.',
      );
    }
  }, [sessions, initial.error]);

  function saveSession(session) {
    setSessions((current) =>
      current.some((item) => item.id === session.id)
        ? current.map((item) => (item.id === session.id ? session : item))
        : [...current, session],
    );
  }

  function deleteSession(id) {
    setSessions((current) => current.filter((session) => session.id !== id));
  }

  return { sessions, saveSession, deleteSession, storageError };
}
