function computeForm(matches) {
  const played = matches.filter((m) => m.status === 'played');
  const won = played.filter((m) => m.our_score > m.their_score).length;
  const drawn = played.filter((m) => m.our_score === m.their_score).length;
  const lost = played.filter((m) => m.our_score < m.their_score).length;
  const goalsFor = played.reduce((sum, m) => sum + (m.our_score || 0), 0);
  const goalsAgainst = played.reduce((sum, m) => sum + (m.their_score || 0), 0);
  const points = won * 3 + drawn;
  return { played: played.length, won, drawn, lost, goalsFor, goalsAgainst, points };
}

export default function ClassificaSection({ matches, standings }) {
  const form = computeForm(matches);

  return (
    <section id="classifica" className="calendar-section">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>Classifica</h2>
          <p className="section-note">Andamento La Marina e classifica del girone.</p>
        </div>

        <div className="sub-block">
          <div className="sub-head reveal">
            <h3>Il nostro andamento</h3>
            <span>Calcolato automaticamente dai risultati</span>
          </div>
          <div className="staff-grid reveal" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            <StatCell label="Punti" value={form.points} highlight />
            <StatCell label="Giocate" value={form.played} />
            <StatCell label="Vinte" value={form.won} />
            <StatCell label="Pareggiate" value={form.drawn} />
            <StatCell label="Perse" value={form.lost} />
            <StatCell label="Diff. reti" value={form.goalsFor - form.goalsAgainst} />
          </div>
        </div>

        <div className="sub-block">
          <div className="sub-head reveal">
            <h3>Classifica girone</h3>
            <span>Aggiornata manualmente dalla società</span>
          </div>
          {standings.length === 0 ? (
            <p className="empty-note">Classifica non ancora disponibile.</p>
          ) : (
            <div className="cal-list reveal">
              <div className="match-row" style={{ background: 'var(--foam-dim)', fontWeight: 600, fontSize: 12 }}>
                <div className="match-main" style={{ gridTemplateColumns: '2fr repeat(7, 1fr)' }}>
                  <div>Squadra</div>
                  <div>Pt</div>
                  <div>G</div>
                  <div>V</div>
                  <div>N</div>
                  <div>P</div>
                  <div>GF</div>
                  <div>GS</div>
                </div>
              </div>
              {standings.map((s) => {
                const isUs = s.team_name.toLowerCase().includes('marina');
                return (
                  <div
                    key={s.id}
                    className="match-row"
                    style={isUs ? { background: 'var(--azure-soft)' } : undefined}
                  >
                    <div className="match-main" style={{ gridTemplateColumns: '2fr repeat(7, 1fr)' }}>
                      <div style={{ fontWeight: isUs ? 700 : 500, color: 'var(--navy)' }}>{s.team_name}</div>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{s.points}</div>
                      <div>{s.played}</div>
                      <div>{s.won}</div>
                      <div>{s.drawn}</div>
                      <div>{s.lost}</div>
                      <div>{s.goals_for}</div>
                      <div>{s.goals_against}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCell({ label, value, highlight }) {
  return (
    <div className="staff-card" style={{ textAlign: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 30,
          fontWeight: 700,
          color: highlight ? 'var(--gold)' : 'var(--navy)',
        }}
      >
        {value}
      </div>
      <div className="staff-role">{label}</div>
    </div>
  );
}
