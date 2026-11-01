# Understanding Bloom Pilates

Bloom solves a familiar problem: an instructor needs a clear view of their classes, times, and available spots. Keeping the scope to a single instructor makes it possible to practice React fundamentals without a server, authentication, or a complicated booking system.

## 1. Start with the data

Each session is a plain JavaScript object:

```js
{
  id: 'a-unique-id',
  title: 'Morning flow',
  date: '2026-10-31',
  time: '08:30',
  duration: 50,
  type: 'Reformer',
  level: 'All levels',
  capacity: 8,
  booked: 6,
  notes: ''
}
```

`id` identifies a session even if its name or time changes. Dates use `YYYY-MM-DD`; start times use a 24-hour `HH:mm` string. Duration, capacity, and booked spots are numbers.

## 2. Read the screen from the top

`main.jsx` mounts `App` into the root element in `index.html`. `App.jsx` composes the sidebar, summary cards, weekly calendar, daily agenda, and editor dialog.

`App` holds UI state with `useState`:

- `selectedDate`: the day shown in the agenda, which also determines the displayed week.
- `type` and `query`: the class-type filter and search text.
- `editor`: whether the form is closed, creating a session, or editing a session.
- `notice`: feedback after a successful change.

The actual session array comes from `useSessions`, a custom hook.

## 3. Pass data down and events up

`App` passes a session and an `onEdit` function to each `SessionCard`. The card displays the session and calls `onEdit(session)` when clicked.

`SessionForm` receives the current session, the schedule for conflict checking, and callbacks named `onSave`, `onDelete`, and `onClose`. It does not write to storage itself. This keeps the form reusable and makes ownership of data clear.

## 4. Use a controlled form

The editor stores field values in `form`. Every input reads its value from that object and uses `onChange` to update it:

```jsx
<input name="title" value={form.title} onChange={update} />
```

The shared `update` handler uses the input's `name` to replace the corresponding field. Number inputs still produce strings, so submission converts numeric fields with `Number()` before validation and saving.

The form uses native HTML validation for required fields and number limits, then applies domain rules from `schedule.js`. A native `<dialog>` provides modal focus behavior and Escape support. The effect closes it when the component unmounts.

## 5. Update arrays without mutation

`useSessions` stores the array in React state. Creating a session uses a new array; editing uses `map`; deleting uses `filter`. These produce new references so React can render the change.

State updates use the functional form, `setSessions(current => ...)`, so each update works with the latest state.

## 6. Derive values instead of duplicating state

The weekly classes, daily results, total booked spots, and teaching hours are calculated from the session array during rendering. They do not need separate state or effects.

For example, booked spots are calculated with `reduce`:

```js
const booked = weeklySessions.reduce((sum, session) => sum + session.booked, 0);
```

This avoids a common bug where a stored total falls out of sync with the actual classes.

## 7. Keep scheduling rules outside React

`schedule.js` contains pure functions. They take inputs and return values without changing the UI or storage, which makes them easy to test.

Two sessions overlap when they share a date and:

```text
newStart < existingEnd AND newEnd > existingStart
```

Strict comparisons allow back-to-back classes. The conflict check ignores the session with the same ID when editing. Bloom assumes one instructor, so even different class types cannot overlap.

Calendar functions construct local dates at noon instead of converting through UTC. This prevents a local date from shifting to the previous or next day because of the device's time zone. Weeks start on Monday and can cross month and year boundaries.

## 8. Persist with one effect

`useSessions` reads storage once using a lazy state initializer. It validates saved records before rendering them. A missing key creates the sample week; an intentionally saved empty array stays empty.

An effect serializes the array to `localStorage` after changes. Writing to browser storage is a side effect because it interacts with a system outside React.

If storage cannot be read, Bloom preserves it and runs with temporary empty state. If a write fails, the current session array remains usable and a visible warning explains that changes may not survive a refresh.

The storage key is `bloom-pilates:sessions:v1`. Data belongs to that browser origin; changing the development server port creates a different storage area.

## 9. Understand the styling

`styles.css` uses ordinary CSS, a few color variables, grid for the summary cards and calendar, and flexbox for session rows. Media queries adapt the layout to tablets and phones. At narrow widths, the sidebar disappears and the class-type dropdown remains available.

Reformer uses rose, Mat uses warm beige, and Private uses sage. Each type also has a text label, so color is not the only cue. Buttons have accessible names and visible keyboard focus. Reduced-motion preferences disable transitions.

## A useful order for reading the code

1. `src/data/demoSessions.js` — see what a session looks like.
2. `src/components/SessionCard.jsx` — understand JSX and props.
3. `src/App.jsx` — follow state, filtering, and component composition.
4. `src/components/SessionForm.jsx` — follow controlled input and validation.
5. `src/hooks/useSessions.js` — learn persistence and immutable updates.
6. `src/lib/schedule.js` and `tests/` — connect scheduling rules to tests.

## Explaining this project in an interview

Describe the instructor's problem first, then show adding a class, catching an overlap, and refreshing to demonstrate persistence. Explain why the schedule is the source of truth and weekly totals are derived from it.

Be clear about the boundaries: this version does not sync across devices, manage individual clients, collect payments, or send booking confirmations. Recurring sessions and a backend are sensible future improvements. Add your own changes and understand the code before presenting the work as part of your portfolio.
