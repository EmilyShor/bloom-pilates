import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Heart,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import SessionCard from './components/SessionCard.jsx';
import SessionForm from './components/SessionForm.jsx';
import { useSessions } from './hooks/useSessions.js';
import {
  CLASS_TYPES,
  addDays,
  dateKey,
  formatDate,
  parseDate,
  sortSessions,
  weekDays,
} from './lib/schedule.js';

export default function App() {
  const [today] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => dateKey(today));
  const [type, setType] = useState('All classes');
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState(null);
  const [notice, setNotice] = useState('');
  const { sessions, saveSession, deleteSession, storageError } = useSessions();
  const days = weekDays(parseDate(selectedDate));
  const weekKeys = days.map(dateKey);
  const weeklySessions = sessions.filter((session) =>
    weekKeys.includes(session.date),
  );
  const daySessions = sortSessions(
    weeklySessions.filter(
      (session) =>
        session.date === selectedDate &&
        (type === 'All classes' || session.type === type) &&
        `${session.title} ${session.level} ${session.notes}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    ),
  );
  const booked = weeklySessions.reduce(
    (sum, session) => sum + session.booked,
    0,
  );
  const capacity = weeklySessions.reduce(
    (sum, session) => sum + session.capacity,
    0,
  );
  const hours =
    weeklySessions.reduce((sum, session) => sum + session.duration, 0) / 60;
  const isToday = selectedDate === dateKey(today);
  const selected = parseDate(selectedDate);
  const filtered = type !== 'All classes' || query.trim();

  function changeWeek(amount) {
    setSelectedDate(dateKey(addDays(selected, amount * 7)));
  }

  function save(session) {
    saveSession(session);
    setSelectedDate(session.date);
    setQuery('');
    setType('All classes');
    setNotice(
      editor?.session
        ? 'Class updated. Everything is in place.'
        : 'Class added. A little more balance in your week.',
    );
    setEditor(null);
  }

  function remove(id) {
    deleteSession(id);
    setEditor(null);
    setNotice('Class removed from your schedule.');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#main">
          <span className="brand-mark">
            <Flower2 strokeWidth={1.2} size={32} />
          </span>
          <span>
            bloom<span className="brand-caption">PILATES STUDIO</span>
          </span>
        </a>
        <p className="sidebar-label">YOUR WORKSPACE</p>
        <div className="nav-active">
          <CalendarDays size={18} />
          <span>Class schedule</span>
          <span className="nav-dot" />
        </div>
        <div className="sidebar-types">
          <p className="sidebar-label">CLASS TYPES</p>
          {['All classes', ...CLASS_TYPES].map((name) => (
            <button
              key={name}
              className={`type-filter ${type === name ? 'selected' : ''}`}
              aria-pressed={type === name}
              onClick={() => setType(name)}
            >
              <span
                className={`type-dot ${name.toLowerCase().replace(' ', '-')}`}
              />
              {name === 'Private' ? 'Private sessions' : name}
              <span className="type-count">
                {
                  weeklySessions.filter(
                    (session) =>
                      name === 'All classes' || session.type === name,
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
        <div className="sidebar-note">
          <Flower2 size={55} strokeWidth={0.8} />
          <p>
            Progress feels better
            <br />
            with a little balance.
          </p>
          <span>ONE BREATH AT A TIME</span>
        </div>
        <div className="workspace-status">
          <span className="status-dot" />
          {storageError ? 'Saved for this visit only' : 'Saved on this device'}
          <span>YOUR PERSONAL STUDIO PLANNER</span>
        </div>
      </aside>

      <main id="main" className="main">
        <header className="topbar">
          <span>
            <span className="mobile-brand">
              bloom <Flower2 size={18} />
            </span>
            <span className="desktop-label">Your studio, in balance.</span>
          </span>
          <div className="topbar-right">
            {sessions.some((session) => session.id.startsWith('demo-')) && (
              <span className="sample-badge">Sample schedule</span>
            )}
            <span className="date-today">
              {formatDate(today, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="avatar" aria-label="Instructor workspace">
              <Flower2 size={19} />
            </span>
          </div>
        </header>
        <div className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">
                <span />
                THE STUDIO EDIT
              </p>
              <h1>
                A week in balance<span>.</span>
              </h1>
              <p className="muted">
                A little structure. More space to do what you love.
              </p>
            </div>
            <button
              className="button primary"
              onClick={() => setEditor({ session: null })}
            >
              <Plus size={18} />
              Schedule class
            </button>
          </section>

          <section className="summary-grid" aria-label="This week's overview">
            <div className="summary-card">
              <span className="stat-icon rose">
                <CalendarDays size={19} strokeWidth={1.6} />
              </span>
              <div>
                <span className="stat-label">Classes this week</span>
                <strong>
                  {weeklySessions.length}
                  <span>sessions</span>
                </strong>
              </div>
              <span className="stat-accent">LET’S MOVE</span>
            </div>
            <div className="summary-card">
              <span className="stat-icon peach">
                <Users size={19} strokeWidth={1.6} />
              </span>
              <div>
                <span className="stat-label">Spots booked</span>
                <strong>
                  {booked}
                  <span>of {capacity}</span>
                </strong>
              </div>
              <span className="stat-accent">
                {capacity ? Math.round((booked / capacity) * 100) : 0}% FULL
              </span>
            </div>
            <div className="summary-card">
              <span className="stat-icon sage">
                <Heart size={19} strokeWidth={1.6} />
              </span>
              <div>
                <span className="stat-label">Time for movement</span>
                <strong>
                  {Number(hours.toFixed(1))}
                  <span>hours</span>
                </strong>
              </div>
              <span className="stat-accent">FEEL-GOOD TIME</span>
            </div>
          </section>

          <section
            className="schedule-section"
            aria-labelledby="schedule-title"
          >
            <div className="schedule-heading">
              <div>
                <h2 id="schedule-title">Your schedule</h2>
                <p className="muted">Good things are on the calendar.</p>
              </div>
              <span className="week-badge">
                <span />
                Week{' '}
                {formatDate(days[0], {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                –{' '}
                {formatDate(days[6], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="calendar-panel">
              <div className="calendar-toolbar">
                <div className="month-navigation">
                  <h3>
                    {formatDate(selected, { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="week-arrows">
                    <button
                      className="icon-button"
                      aria-label="Previous week"
                      onClick={() => changeWeek(-1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label="Next week"
                      onClick={() => changeWeek(1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <button
                    className="today-button"
                    onClick={() => setSelectedDate(dateKey(today))}
                  >
                    Today
                  </button>
                </div>
                <span className="calendar-caption">
                  <CalendarDays size={15} />
                  Week view
                </span>
              </div>
              <div className="week-strip" aria-label="Choose a day">
                {days.map((day) => {
                  const key = dateKey(day);
                  const count = weeklySessions.filter(
                    (session) => session.date === key,
                  ).length;
                  return (
                    <button
                      key={key}
                      className={`day-button ${selectedDate === key ? 'active' : ''} ${dateKey(today) === key ? 'is-today' : ''}`}
                      aria-pressed={selectedDate === key}
                      aria-label={formatDate(day, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      onClick={() => setSelectedDate(key)}
                    >
                      <span className="day-name">
                        {formatDate(day, { weekday: 'short' })}
                      </span>
                      <strong>{day.getDate()}</strong>
                      <span className="day-count">
                        {count
                          ? `${count} ${count === 1 ? 'class' : 'classes'}`
                          : 'A little space'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="agenda-toolbar">
              <div>
                <h3>
                  {isToday
                    ? 'Today'
                    : formatDate(selected, { weekday: 'long' })}
                  <span>
                    {formatDate(selected, { month: 'short', day: 'numeric' })}
                  </span>
                </h3>
                <span className="class-count">
                  {daySessions.length}{' '}
                  {daySessions.length === 1 ? 'class' : 'classes'} planned
                </span>
              </div>
              <div className="agenda-filters">
                <label className="search-field">
                  <Search size={16} />
                  <input
                    aria-label="Search classes"
                    placeholder="Find a class…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {query && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setQuery('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
                <label className="type-select">
                  <SlidersHorizontal size={15} />
                  <select
                    aria-label="Filter class type"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                  >
                    {['All classes', ...CLASS_TYPES].map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="session-list">
              {daySessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onEdit={(item) => setEditor({ session: item })}
                />
              ))}
              {!daySessions.length && (
                <div className="empty-state">
                  <Flower2 size={38} strokeWidth={1} />
                  <h3>
                    {filtered
                      ? 'A little too specific?'
                      : 'A little room to breathe.'}
                  </h3>
                  <p>
                    {filtered
                      ? 'Try another search or class type.'
                      : 'Your day is open. Add a class when you’re ready.'}
                  </p>
                  <button
                    className="button secondary"
                    onClick={() => {
                      if (filtered) {
                        setType('All classes');
                        setQuery('');
                      } else setEditor({ session: null });
                    }}
                  >
                    {filtered ? 'Clear filters' : 'Schedule a class'}
                    {filtered ? <ArrowLeft size={15} /> : <Plus size={15} />}
                  </button>
                </div>
              )}
            </div>
            <button
              className="add-class-row"
              onClick={() => setEditor({ session: null })}
            >
              <Plus size={17} />
              Make space for another class
              <span>
                Add a session
                <ArrowRight size={16} />
              </span>
            </button>
          </section>
          <footer className="page-footer">
            <span>
              <Sparkles size={14} />
              Mindful movement. Thoughtfully planned.
            </span>
            <span>Made for the way you teach.</span>
          </footer>
        </div>
      </main>
      {storageError && (
        <div className="storage-warning" role="alert">
          {storageError}
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          <Check size={18} />
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice('')}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {editor && (
        <SessionForm
          session={editor.session}
          date={selectedDate}
          sessions={sessions}
          onSave={save}
          onDelete={remove}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  );
}
