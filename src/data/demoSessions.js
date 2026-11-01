import { addDays, dateKey, startOfWeek } from '../lib/schedule.js';

export function createDemoSessions(today = new Date()) {
  const monday = startOfWeek(today);
  const classes = [
    [0, '08:00', 'Morning flow', 'Reformer', 50, 8, 6, 'All levels'],
    [0, '17:00', 'Core & restore', 'Mat', 45, 12, 8, 'Beginner'],
    [1, '09:00', 'Reformer foundations', 'Reformer', 50, 8, 5, 'Beginner'],
    [2, '08:30', 'Slow & strong', 'Mat', 50, 12, 9, 'All levels'],
    [2, '11:00', 'Personal practice', 'Private', 60, 1, 1, 'All levels'],
    [3, '09:00', 'Lengthen & strengthen', 'Reformer', 50, 8, 7, 'Intermediate'],
    [4, '08:00', 'Morning flow', 'Reformer', 50, 8, 8, 'All levels'],
    [4, '16:00', 'Friday unwind', 'Mat', 45, 12, 6, 'All levels'],
    [5, '08:30', 'Morning flow', 'Reformer', 50, 8, 6, 'All levels'],
    [5, '10:00', 'Sculpt & balance', 'Mat', 45, 12, 9, 'Intermediate'],
    [5, '12:00', 'Personal practice', 'Private', 60, 1, 1, 'All levels'],
    [6, '09:00', 'Sunday reset', 'Mat', 50, 12, 7, 'All levels'],
  ];
  return classes.map(
    ([day, time, title, type, duration, capacity, booked, level], index) => ({
      id: `demo-${index}`,
      date: dateKey(addDays(monday, day)),
      time,
      title,
      type,
      duration,
      capacity,
      booked,
      level,
      notes: '',
    }),
  );
}
