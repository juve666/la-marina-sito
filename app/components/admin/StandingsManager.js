'use client';

import { useEffect, useState } from 'react';

const EMPTY = {
  team_name: '',
  played: '',
  won: '',
  drawn: '',
  lost: '',
  goals_for: '',
  goals_against: '',
  points: '',
  sort_order: '',
};

export default function StandingsManager() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/standings');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(r) {
    setEditingId(r.id);
    setForm({
      team_name: r.team_name ?? '',
      played: r.played ?? '',
      won: r.won ?? '',
      drawn: r.drawn ?? '',
      lost: r.lost ?? '',
      goals_for: r.goals_for ?? '',
      goals_against: r.goals_against ?? '',
      points: r.points ?? '',
      sort_order: r.sort_order ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    if (!form.team_name) {
      setMsg({ type: 'error', text: 'Il nome della squadra è obbligatorio.' });
      return;
    }
    const url = editingId ? `/api/standings/${editingId}` : '/api/standings';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg({ type: 'ok', text: editingId ? 'Riga aggiornata.' : 'Riga aggiunta.' });
      cancelEdit();
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg({ type: 'error', text: data.error || 'Errore durante il salvataggio.' });
    }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questa riga di classifica?')) return;
    const res = await fetch(`/api/standings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      load();
    } else {
      setMsg({ type: 'error', text: "Errore durante l'eliminazione." });
    }
  }

  return (
    <div>
      <div className="admin-card">
        <h3>{editingId ? 'Modifica riga classifica' : 'Aggiungi squadra alla classifica'}</h3>
        <p style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 14 }}>
          Copia questi numeri dal sito ufficiale del girone ogni volta che vengono aggiornati.
        </p>
        {msg && <div className={`admin-msg ${msg.type === 'error' ? 'error' : ''}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Squadra</label>
              <input
                type="text"
                value={form.team_name}
                onChange={(e) => setForm({ ...form, team_name: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Punti</label>
              <input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Giocate</label>
              <input type="number" value={form.played} onChange={(e) => setForm({ ...form, played: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Vinte</label>
              <input type="number" value={form.won} onChange={(e) => setForm({ ...form, won: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Pareggiate</label>
              <input type="number" value={form.drawn} onChange={(e) => setForm({ ...form, drawn: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Perse</label>
              <input type="number" value={form.lost} onChange={(e) => setForm({ ...form, lost: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Gol fatti</label>
              <input
                type="number"
                value={form.goals_for}
                onChange={(e) => setForm({ ...form, goals_for: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Gol subiti</label>
              <input
                type="number"
                value={form.goals_against}
                onChange={(e) => setForm({ ...form, goals_against: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Ordine (opzionale)</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-row-actions">
            <button className="btn-admin" type="submit">
              {editingId ? 'Salva modifiche' : 'Aggiungi'}
            </button>
            {editingId && (
              <button className="btn-admin secondary" type="button" onClick={cancelEdit}>
                Annulla
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h3>Classifica attuale</h3>
        {loading ? (
          <p>Caricamento…</p>
        ) : rows.length === 0 ? (
          <p>Nessuna squadra inserita.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Squadra</th>
                <th>Pt</th>
                <th>G</th>
                <th>V</th>
                <th>N</th>
                <th>P</th>
                <th>GF</th>
                <th>GS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.team_name}</td>
                  <td>{r.points}</td>
                  <td>{r.played}</td>
                  <td>{r.won}</td>
                  <td>{r.drawn}</td>
                  <td>{r.lost}</td>
                  <td>{r.goals_for}</td>
                  <td>{r.goals_against}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn-admin secondary small" onClick={() => startEdit(r)}>
                        Modifica
                      </button>
                      <button className="btn-admin danger small" onClick={() => handleDelete(r.id)}>
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
