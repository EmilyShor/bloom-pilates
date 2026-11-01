import { describe, expect, it } from 'vitest';
import {
  addDays,
  dateKey,
  endTime,
  hasConflict,
  isStoredSession,
  parseDate,
  sortSessions,
  validateSession,
  weekDays,
} from '../src/lib/schedule.js';

const session = {
  id: 'one',
  title: 'Morning flow',
  date: '2026-10-31',
  time: '09:00',
  duration: 50,
  capacity: 8,
  booked: 6,
  type: 'Reformer',
  level: 'All levels',
  notes: '',
};

describe('calendar dates', () => {
  it('keeps local dates intact and crosses month and year boundaries', () => {
    expect(dateKey(parseDate('2026-10-31'))).toBe('2026-10-31');
    expect(dateKey(addDays(parseDate('2026-12-31'), 1))).toBe('2027-01-01');
    expect(weekDays(parseDate('2026-11-01')).map(dateKey)).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
  });
  it('calculates session end times', () => {
    expect(endTime('09:45', 50)).toBe('10:35');
    expect(endTime('23:00', 60)).toBe('24:00');
  });
});

describe('session rules', () => {
  it('accepts a valid session', () =>
    expect(validateSession(session)).toBe(''));
  it('rejects blank names, impossible dates, invalid times, and classes after midnight', () => {
    expect(validateSession({ ...session, title: '   ' })).toMatch(/name/);
    expect(validateSession({ ...session, date: '2026-02-30' })).toMatch(/date/);
    expect(validateSession({ ...session, time: '25:00' })).toMatch(/time/);
    expect(validateSession({ ...session, time: '23:45' })).toMatch(/midnight/);
  });
  it('prevents overbooking, fractional counts, and invalid capacities', () => {
    expect(validateSession({ ...session, booked: 9 })).toMatch(/capacity/);
    expect(validateSession({ ...session, booked: -1 })).toMatch(/negative/);
    expect(validateSession({ ...session, capacity: 0 })).toMatch(/Capacity/);
    expect(validateSession({ ...session, booked: 1.5 })).toMatch(/Booked/);
  });
  it('rejects partial overlaps, containment, and identical start times', () => {
    expect(
      hasConflict({ ...session, id: 'two', time: '09:30' }, [session]),
    ).toBe(true);
    expect(
      hasConflict({ ...session, id: 'two', time: '08:30', duration: 120 }, [
        session,
      ]),
    ).toBe(true);
    expect(hasConflict({ ...session, id: 'two' }, [session])).toBe(true);
  });
  it('allows back-to-back sessions, other days, and editing the same class', () => {
    expect(
      hasConflict({ ...session, id: 'two', time: '09:50' }, [session]),
    ).toBe(false);
    expect(
      hasConflict({ ...session, id: 'two', date: '2026-11-01' }, [session]),
    ).toBe(false);
    expect(hasConflict(session, [session])).toBe(false);
  });
  it('validates saved data before rendering it', () => {
    expect(isStoredSession(session)).toBe(true);
    expect(isStoredSession({ ...session, notes: null })).toBe(false);
    expect(isStoredSession({ ...session, booked: 99 })).toBe(false);
  });
  it('sorts chronologically without mutating its input', () => {
    const earlier = { ...session, id: 'earlier', time: '08:00' };
    const input = [session, earlier];
    expect(sortSessions(input).map((item) => item.id)).toEqual([
      'earlier',
      'one',
    ]);
    expect(input[0].id).toBe('one');
  });
});
