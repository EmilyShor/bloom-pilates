export const CLASS_TYPES = ['Reformer', 'Mat', 'Private'];
export const LEVELS = ['All levels', 'Beginner', 'Intermediate', 'Advanced'];
export const STORAGE_KEY = 'bloom-pilates:sessions:v1';

// Work with local calendar dates. toISOString() would shift dates in some time zones.
export function dateKey(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfWeek(date) {
  return addDays(date, -((date.getDay() + 6) % 7));
}

export function weekDays(date) {
  const monday = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function minutes(time) {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

export function endTime(time, duration) {
  const total = minutes(time) + Number(duration);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function formatDate(date, options) {
  return new Intl.DateTimeFormat('en', options).format(date);
}

export function validateSession(session) {
  if (!session.title.trim()) return 'Give your class a name.';
  if (session.title.trim().length > 70)
    return 'Keep the class name under 71 characters.';
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(session.date) ||
    dateKey(parseDate(session.date)) !== session.date
  )
    return 'Choose a valid date.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(session.time))
    return 'Choose a valid start time.';
  if (!CLASS_TYPES.includes(session.type) || !LEVELS.includes(session.level))
    return 'Choose a class type and level.';
  if (
    !Number.isInteger(Number(session.duration)) ||
    Number(session.duration) < 15 ||
    Number(session.duration) > 180
  )
    return 'Duration must be 15–180 minutes.';
  if (minutes(session.time) + Number(session.duration) > 1440)
    return 'Your class must finish by midnight.';
  if (
    !Number.isInteger(Number(session.capacity)) ||
    Number(session.capacity) < 1 ||
    Number(session.capacity) > 100
  )
    return 'Capacity must be between 1 and 100.';
  if (
    !Number.isInteger(Number(session.booked)) ||
    Number(session.booked) < 0 ||
    Number(session.booked) > Number(session.capacity)
  )
    return 'Booked spots cannot exceed capacity or be negative.';
  return '';
}

// One instructor: overlapping sessions would make the schedule impossible to teach.
export function hasConflict(candidate, sessions) {
  const start = minutes(candidate.time);
  const end = start + Number(candidate.duration);
  return sessions.some(
    (session) =>
      session.id !== candidate.id &&
      session.date === candidate.date &&
      start < minutes(session.time) + session.duration &&
      end > minutes(session.time),
  );
}

export function sortSessions(sessions) {
  return [...sessions].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  );
}

export function isStoredSession(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.date === 'string' &&
    typeof value.time === 'string' &&
    typeof value.notes === 'string' &&
    typeof value.duration === 'number' &&
    typeof value.capacity === 'number' &&
    typeof value.booked === 'number' &&
    !validateSession(value)
  );
}
