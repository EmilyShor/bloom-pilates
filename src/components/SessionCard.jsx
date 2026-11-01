import { ArrowUpRight, Clock3, Users } from 'lucide-react';
import { endTime } from '../lib/schedule.js';

export default function SessionCard({ session, onEdit }) {
  const full = session.booked === session.capacity;
  const spots = session.capacity - session.booked;
  return (
    <article className={`session-card ${session.type.toLowerCase()}`}>
      <div className="session-time">
        <strong>{session.time}</strong>
        <span>{endTime(session.time, session.duration)}</span>
      </div>
      <div className="session-body">
        <div className="session-tags">
          <span className={`type-tag ${session.type.toLowerCase()}`}>
            <i />
            {session.type}
          </span>
          <span className="level">{session.level}</span>
        </div>
        <button className="session-title" onClick={() => onEdit(session)}>
          {session.title}
        </button>
        <div className="session-meta">
          <span>
            <Clock3 size={14} />
            {session.duration} min
          </span>
          <span>
            <Users size={14} />
            {session.booked}/{session.capacity} booked
          </span>
        </div>
        {session.notes && <p className="session-notes">{session.notes}</p>}
      </div>
      <div className="session-capacity">
        <span className={full ? 'availability full' : 'availability'}>
          {full
            ? 'Fully booked'
            : `${spots} ${spots === 1 ? 'spot' : 'spots'} open`}
        </span>
        <div
          className="capacity-track"
          role="meter"
          aria-label={`${session.title} capacity`}
          aria-valuenow={session.booked}
          aria-valuemin={0}
          aria-valuemax={session.capacity}
        >
          <span
            style={{ width: `${(session.booked / session.capacity) * 100}%` }}
          />
        </div>
      </div>
      <button
        className="card-edit icon-button"
        aria-label={`Edit ${session.title}`}
        onClick={() => onEdit(session)}
      >
        <ArrowUpRight size={21} />
      </button>
    </article>
  );
}
