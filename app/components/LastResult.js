function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function resultTag(our, their) {
  if (our > their) return { label: 'Vittoria', color: 'var(--gold)' };
  if (our < their) return { label: 'Sconfitta', color: '#E3B3B3' };
  return { label: 'Pareggio', color: 'var(--azure-soft)' };
}

export default function LastResult({ match }) {
  return (
    <section className="last-result-section">
      <div className="wrap">
        <div className="lr-label reveal">Ultima partita giocata</div>

        {!match ? (
          <div className="lr-empty reveal">
            Nessuna partita giocata finora. Il risultato dell'ultimo match comparirà qui non
            appena verrà registrato dall'area admin.
          </div>
        ) : (
          <div className="lr-card reveal">
            <div className="lr-teams">
              <div className="lr-team">
                <div className={`lr-team-badge ${match.is_home ? 'us' : ''}`}>
                  {match.is_home ? <img src="/logo.png" alt="La Marina" /> : squad(match.opponent)}
                </div>
                <div className="lr-team-name">{match.is_home ? 'La Marina' : match.opponent}</div>
              </div>
              <div className="lr-score">
                {match.is_home ? match.our_score : match.their_score}
                <span className="dash">–</span>
                {match.is_home ? match.their_score : match.our_score}
              </div>
              <div className="lr-team">
                <div className={`lr-team-badge ${!match.is_home ? 'us' : ''}`}>
                  {!match.is_home ? <img src="/logo.png" alt="La Marina" /> : squad(match.opponent)}
                </div>
                <div className="lr-team-name">{!match.is_home ? 'La Marina' : match.opponent}</div>
              </div>
            </div>
            <div className="lr-meta">
              <span className="tag">{resultTag(match.our_score, match.their_score).label}</span>
              <span className="comp">
                Serie C2 · Girone C{match.giornata ? ` · ${match.giornata}ª giornata` : ''}
              </span>
              <span className="date">{formatDate(match.match_date)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function squad(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
