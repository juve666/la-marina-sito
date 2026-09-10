export default function ContactSection() {
  return (
    <section id="contatti" className="contact-section">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>Contatti</h2>
          <p className="section-note">Scrivici o seguici sui social.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-block reveal">
            <p>
              Per informazioni su tesseramenti, prove e sponsorizzazioni, contatta la società.
            </p>
            <div className="contact-list">
              <a href="mailto:info@lamarinacalcioa5.it">
                <span>info@lamarinacalcioa5.it</span>
                <span className="lbl">Email</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <span>@lamarinacalcioa5</span>
                <span className="lbl">Instagram</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <span>La Marina Calcio a 5</span>
                <span className="lbl">Facebook</span>
              </a>
              <a href="tel:+390942000000">
                <span>+39 0942 000000</span>
                <span className="lbl">Telefono</span>
              </a>
            </div>
          </div>
          <div className="venue-box reveal">
            <h4>Casa</h4>
            <p>PalaSport Comunale</p>
            <p>Via del Mare, snc</p>
            <p>98037 Letojanni (ME)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
