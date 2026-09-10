'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Password errata');
      }
    } catch (err) {
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="La Marina" className="login-logo" />
        <h1>Area riservata</h1>
        <p>Inserisci la password per gestire giocatori, dirigenza e calendario.</p>
        {error && <div className="admin-msg error">{error}</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button className="btn-admin" type="submit" disabled={loading}>
          {loading ? 'Verifica…' : 'Accedi'}
        </button>
      </form>
    </div>
  );
}
