export default function SquadraSection({ staff, players }) {
  return (
    <section id="squadra" className="squadra-section">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>Squadra</h2>
          <p className="section-note">Dirigenza, staff tecnico e rosa giocatori.</p>
        </div>

        <div className="sub-block">
          <div className="sub-head reveal">
            <h3>Dirigenza</h3>
            <span>Staff societario e tecnico</span>
          </div>
          {staff.length === 0 ? (
            <p className="empty-note">Nessun membro dello staff inserito ancora.</p>
          ) : (
            <div className="staff-grid">
              {staff.map((s) => (
                <div className="staff-card reveal" key={s.id}>
                  <div className="staff-role">{s.role}</div>
                  <div className="staff-name">{s.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sub-block">
          <div className="sub-head reveal">
            <h3>Rosa</h3>
            <span>Stagione in corso</span>
          </div>
          {players.length === 0 ? (
            <p className="empty-note">Nessun giocatore inserito ancora.</p>
          ) : (
            <div className="roster-grid">
              {players.map((p) => (
                <div className="player reveal" key={p.id}>
                  <div className="player-num">{p.number ?? '-'}</div>
                  <div className="player-name">{p.name}</div>
                  <div className="player-role">{p.role}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
