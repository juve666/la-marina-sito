'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'calendario', label: 'Calendario' },
  { id: 'classifica', label: 'Classifica' },
  { id: 'squadra', label: 'Squadra' },
  { id: 'contatti', label: 'Contatti' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  const NavLinks = ({ mobile }) =>
    NAV_ITEMS.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        className={active === item.id ? 'active' : ''}
        onClick={() => mobile && setMenuOpen(false)}
      >
        {item.label}
      </a>
    ));

  return (
    <header className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar">
        <div className="brand">
          <div className="logo-mark" aria-hidden="true">
            <img src="/logo.png" alt="Stemma A.S.D. La Marina" />
          </div>
          <div className="brand-name">
            La <span>Marina</span>
          </div>
        </div>
        <nav className="links">
          <NavLinks mobile={false} />
        </nav>
        <button
          className="nav-toggle"
          aria-label="Apri menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className="mobile-menu">
        <NavLinks mobile={true} />
      </div>
    </header>
  );
}
