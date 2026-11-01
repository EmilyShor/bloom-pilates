import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';
import { dateKey, STORAGE_KEY } from '../src/lib/schedule.js';

async function createClass(user, name = 'Sunset stretch') {
  await user.click(
    screen.getByRole('button', { name: 'Schedule class', exact: true }),
  );
  const dialog = screen.getByRole('dialog');
  await user.type(within(dialog).getByLabelText('Class name'), name);
  await user.clear(within(dialog).getByLabelText('Start time'));
  await user.type(within(dialog).getByLabelText('Start time'), '19:00');
  await user.click(
    within(dialog).getByRole('button', { name: 'Add to schedule' }),
  );
}

describe('instructor workflows', () => {
  it('adds, edits, persists, and removes a class', async () => {
    localStorage.setItem(STORAGE_KEY, '[]');
    const user = userEvent.setup();
    const view = render(<App />);
    await createClass(user);
    expect(
      screen.getByRole('button', { name: 'Sunset stretch', exact: true }),
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0].title).toBe(
      'Sunset stretch',
    );
    await user.click(
      screen.getByRole('button', { name: 'Edit Sunset stretch' }),
    );
    const name = screen.getByLabelText('Class name');
    await user.clear(name);
    await user.type(name, 'Evening flow');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    view.unmount();
    render(<App />);
    expect(
      screen.getByRole('button', { name: 'Evening flow', exact: true }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Edit Evening flow' }));
    await user.click(screen.getByRole('button', { name: 'Delete class' }));
    await user.click(screen.getByRole('button', { name: 'Yes, remove class' }));
    expect(
      screen.queryByRole('button', { name: 'Evening flow', exact: true }),
    ).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
  });
  it('shows helpful empty results and clears filters', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(
      screen.getByRole('textbox', { name: 'Search classes' }),
      'no-such-class',
    );
    expect(screen.getByText('A little too specific?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('textbox', { name: 'Search classes' })).toHaveValue(
      '',
    );
    expect(
      screen.queryByText('A little too specific?'),
    ).not.toBeInTheDocument();
  });
  it('prevents scheduling overlapping classes and overbooking', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'existing',
          title: 'Existing session',
          date: dateKey(new Date()),
          time: '19:00',
          duration: 50,
          type: 'Reformer',
          level: 'All levels',
          booked: 6,
          capacity: 8,
          notes: '',
        },
      ]),
    );
    const user = userEvent.setup();
    render(<App />);
    await createClass(user);
    expect(screen.getByRole('alert')).toHaveTextContent('already have a class');
    const booked = screen.getByLabelText('Booked spots');
    await user.clear(booked);
    await user.type(booked, '9');
    await user.click(screen.getByRole('button', { name: 'Add to schedule' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'cannot exceed capacity',
    );
  });
  it('navigates away and returns to today', async () => {
    const user = userEvent.setup();
    render(<App />);
    const todayButtonName = new Intl.DateTimeFormat('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());
    await user.click(screen.getByRole('button', { name: 'Next week' }));
    expect(
      screen.queryByRole('button', { name: todayButtonName }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Today', exact: true }),
    );
    expect(
      screen.getByRole('button', { name: todayButtonName }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
  it('keeps a deliberately empty saved schedule empty', () => {
    localStorage.setItem(STORAGE_KEY, '[]');
    render(<App />);
    expect(screen.getByText('A little room to breathe.')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
  });
  it('preserves malformed storage and explains that changes are temporary', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('could not be read');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{broken');
  });
  it('handles unavailable storage without crashing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('could not save');
  });
});
