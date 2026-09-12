export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="eyebrow-row reveal">
          <div className="logo-mark big" aria-hidden="true">
            <img src="/logo.png" alt="Stemma A.S.D. La Marina" />
          </div>
          <span className="eyebrow">A.S.D. Calcio a 5 · Letojanni</span>
        </div>
        <h1 className="reveal">
          La <em>Marina</em>
        </h1>
        <p className="hero-sub reveal">
          Dal lungomare di Letojanni al parquet della Serie C2, Girone C. Una squadra, un colore:
          il blu del mare che ci guarda giocare.
        </p>
        <div className="colori-chips reveal">
          <div className="chip">
            <span className="dot" style={{ background: '#2E7FB8' }}></span>Blu
          </div>
          <div className="chip">
            <span
              className="dot"
              style={{ background: '#FFFFFF', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)' }}
            ></span>
            Bianco
          </div>
          <div className="chip">
            <span className="dot" style={{ background: '#F0B429' }}></span>Serie C2 · Girone C
          </div>
        </div>
      </div>
      <div className="wave-stack">
        <svg className="wave-back" viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40C240 10 480 54 720 34C960 14 1200 44 1440 20V64H0V40Z" fill="#DCEAF3" />
        </svg>
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 32C240 64 480 0 720 20C960 40 1200 64 1440 24V64H0V32Z" fill="#FAF8F3" />
        </svg>
      </div>
    </section>
  );
}
