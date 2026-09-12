function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ photoUrl, name, size = 64 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'var(--foam-dim)',
        border: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {photoUrl ? (
        <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--azure)' }}>
          {initials(name)}
        </span>
      )}
    </div>
  );
}

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
                <div
                  className="staff-card reveal"
                  key={s.id}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}
                >
                  <Avatar photoUrl={s.photo_url} name={s.name} size={52} />
                  <div>
                    <div className="staff-role">{s.role}</div>
                    <div className="staff-name">{s.name}</div>
                  </div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Avatar photoUrl={p.photo_url} name={p.name} size={56} />
                    <div className="player-num" style={{ fontSize: 32 }}>
                      {p.number ?? '-'}
                    </div>
                  </div>
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
