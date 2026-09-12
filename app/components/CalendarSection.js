'use client';

import { useState } from 'react';

function formatDate(dateStr, timeStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const dateFmt = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
  return timeStr ? `${dateFmt} · ${timeStr.slice(0, 5)}` : dateFmt;
}

function resultClass(match) {
  if (match.status !== 'played') return 'upcoming';
  const ourGoals = match.our_score;
  const theirGoals = match.their_score;
  if (ourGoals > theirGoals) return 'win';
  if (ourGoals < theirGoals) return 'loss';
  return '';
}

function formatScorers(match) {
  if (!match.scorers || match.scorers.length === 0) return null;
  return match.scorers.map((s) => (s.goals > 1 ? `${s.player_name} (${s.goals})` : s.player_name)).join(', ');
}

export default function CalendarSection({ matches }) {
  const [filter, setFilter] = useState('all');

  const sorted = [...matches].sort((a, b) => (a.giornata || 0) - (b.giornata || 0));
  const visible = sorted.filter((m) => filter === 'all' || m.status === filter);

  return (
    <section id="calendario" className="calendar-section">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>Calendario</h2>
          <p className="section-note">Tutte le giornate del girone, con date e risultati.</p>
        </div>

        <div className="cal-tabs reveal">
          <button className={`cal-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Tutte
          </button>
          <button className={`cal-tab ${filter === 'played' ? 'active' : ''}`} onClick={() => setFilter('played')}>
            Giocate
          </button>
          <button className={`cal-tab ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>
            Da giocare
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="cal-list reveal is-empty">
            <p className="empty-note">Nessuna partita in questa categoria.</p>
          </div>
        ) : (
          <div className="cal-list reveal">
            {visible.map((m) => {
              const scorersText = m.status === 'played' ? formatScorers(m) : null;
              return (
                <div key={m.id} className={`match-row ${resultClass(m)}`}>
                  <div className="match-main">
                    <div className="giornata">{m.giornata ? `G${m.giornata}` : ''}</div>
                    <div className="match-teams">
                      {m.is_home ? (
                        <>
                          <span className="us">La Marina</span>
                          <span className="vs">vs</span>
                          <span>{m.opponent}</span>
                        </>
                      ) : (
                        <>
                          <span>{m.opponent}</span>
                          <span className="vs">vs</span>
                          <span className="us">La Marina</span>
                        </>
                      )}
                    </div>
                    <div className={`match-score ${m.status !== 'played' ? 'pending' : ''}`}>
                      {m.status === 'played'
                        ? m.is_home
                          ? `${m.our_score}–${m.their_score}`
                          : `${m.their_score}–${m.our_score}`
                        : 'Da giocare'}
                    </div>
                    <div className="match-date">{formatDate(m.match_date, m.match_time)}</div>
                  </div>
                  {scorersText && (
                    <div className="match-scorers">
                      <span className="lbl">Marcatori</span>
                      <span className="names">{scorersText}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
