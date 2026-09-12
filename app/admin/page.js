'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlayersManager from '../components/admin/PlayersManager';
import StaffManager from '../components/admin/StaffManager';
import MatchesManager from '../components/admin/MatchesManager';
import StandingsManager from '../components/admin/StandingsManager';

const TABS = [
  { id: 'players', label: 'Giocatori' },
  { id: 'staff', label: 'Dirigenza' },
  { id: 'matches', label: 'Calendario' },
  { id: 'standings', label: 'Classifica' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('players');
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="title">
          La <span>Marina</span> · Area riservata
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Esci
        </button>
      </div>

      <div className="admin-body">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-tab"
            style={{ marginLeft: 'auto' }}
          >
            Vedi sito ↗
          </a>
        </div>

        {tab === 'players' && <PlayersManager />}
        {tab === 'staff' && <StaffManager />}
        {tab === 'matches' && <MatchesManager />}
        {tab === 'standings' && <StandingsManager />}
      </div>
    </div>
  );
}
