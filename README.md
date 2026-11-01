# Bloom Pilates 🌸

**Your studio, in balance.** A clean, pink schedule manager for a Pilates instructor, built with React and JavaScript.

[![Test and build](https://github.com/EmilyShor/bloom-pilates/actions/workflows/ci.yml/badge.svg)](https://github.com/EmilyShor/bloom-pilates/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-ead4df?logo=react&logoColor=8f4d69)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_modules-f5e6b9?logo=javascript&logoColor=6f5b25)
![Vite](https://img.shields.io/badge/Vite-8-ece4f6?logo=vite&logoColor=8a67aa)

Bloom is a focused junior development project: one useful screen, understandable components, and real scheduling rules. It starts with an editable sample week so you can explore the app immediately.

![Bloom Pilates schedule](https://github.com/user-attachments/assets/e52076da-4862-4d2a-a1fd-13c19b437e6b)

<details>
<summary>See the phone layout</summary>

<br />
<img src="https://github.com/user-attachments/assets/e0e7e95e-3aef-477b-9342-840d4e47b9d8" alt="Bloom Pilates schedule on a phone" width="340" />

</details>

## What you can do

- Browse a Monday–Sunday week and jump back to today.
- Add, edit, and delete classes with a confirmation before removal.
- Plan Reformer, Mat, and Private sessions with a level and optional notes.
- Set a start time, duration, capacity, and booked spots.
- Prevent overlapping classes and bookings above capacity.
- Search the selected day's classes and filter by class type.
- See weekly class counts, booked spots, and teaching hours.
- Keep your schedule after refreshing, using browser `localStorage`.
- Use the responsive layout on a desktop or phone.

## Run it locally

Install **Node.js 24.15 or newer** and **pnpm 11**. Then run:

```bash
git clone https://github.com/EmilyShor/bloom-pilates.git
cd bloom-pilates
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed in the terminal, normally `http://127.0.0.1:5173`.

If pnpm is missing, install it with `npm install -g pnpm@11.25.0` after installing Node.js. No API key, account, or `.env` file is needed to run Bloom.

## Commands

| Command             | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Start the development server with live updates |
| `pnpm test`         | Run the automated tests once                   |
| `pnpm test:watch`   | Run tests as you make changes                  |
| `pnpm build`        | Create a production build in `dist/`           |
| `pnpm preview`      | Serve the production build locally             |
| `pnpm format`       | Format the source and documentation            |
| `pnpm format:check` | Check formatting without changing files        |

## A quick tour

1. Select a day in the calendar strip.
2. Click **Schedule class** and enter your session details.
3. Click a class name or its arrow to edit it, update booked spots, or remove it.
4. Use the arrows beside the month to change weeks.
5. Search and class-type filters apply to the selected day. Summary cards and calendar counts always describe the whole week.

Booked spots are a count you manage yourself. Bloom does not send invitations or take client bookings.

## Tech stack

React, JavaScript, Vite, plain CSS, and Lucide icons. Vitest, React Testing Library, and jsdom test the scheduling logic and user workflows. Prettier keeps the code readable.

There is no backend or global state library. State lives in `App`, persistence lives in one custom hook, and calendar rules are ordinary JavaScript functions.

## Project structure

```text
src/
  App.jsx                    # Screen, selected date, filters, and actions
  main.jsx                   # React entry point
  styles.css                 # Pink theme and responsive layout
  components/
    SessionCard.jsx          # One class in the daily agenda
    SessionForm.jsx          # Accessible native dialog and class editor
  hooks/
    useSessions.js           # Schedule state and localStorage persistence
  data/
    demoSessions.js          # Sample classes for the current week
  lib/
    schedule.js              # Dates, validation, sorting, conflict detection
tests/
  App.test.jsx               # Instructor workflow tests
  schedule.test.js           # Scheduling rules and date tests
  setup.js                   # Browser test setup
docs/
  PROJECT_GUIDE.md           # Beginner-friendly code walkthrough
  TESTING.md                 # Automated and manual verification
```

## Learn from the code

Start with the [project guide](docs/PROJECT_GUIDE.md). It explains React state, props, controlled forms, immutable updates, derived values, and persistence using examples from Bloom. The [testing guide](docs/TESTING.md) describes the checks and a short demo script.

## Data and scope

This is a single-instructor, browser-only planner. Data stays in the browser profile and origin where you enter it; it does not sync across devices. Clearing site data clears the schedule. Unreadable stored data is preserved and an on-screen warning explains when changes are temporary.

The initial week contains sample classes, not real client bookings. Edit or remove them before using the planner for your own sessions. The app stores booking counts, not client names or health information. All times are local to your device. Classes may finish at midnight but cannot continue into the next day.

Google Fonts provides optional typography; the layout falls back to system sans-serif fonts if unavailable. All other app behavior runs without an external service after the app has loaded.

## Possible next steps

- Add recurring weekly classes.
- Add export and import so schedules can be backed up.
- Add a month view.
- Add a backend and authentication for syncing between devices.

## References

- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [Vite: Getting started](https://vite.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

Built as a personal junior development project for a Pilates instructor.
