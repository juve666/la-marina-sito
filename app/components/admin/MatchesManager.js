'use client';

import { useEffect, useState } from 'react';

const EMPTY = {
  giornata: '',
  match_date: '',
  match_time: '',
  opponent: '',
  is_home: true,
  status: 'upcoming',
  our_score: '',
  their_score: '',
  location: '',
};

export default function MatchesManager() {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [scorers, setScorers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/matches');
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    list.sort((a, b) => (a.giornata || 0) - (b.giornata || 0));
    setMatches(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(m) {
    setEditingId(m.id);
    setForm({
      giornata: m.giornata ?? '',
      match_date: m.match_date ?? '',
      match_time: m.match_time ? m.match_time.slice(0, 5) : '',
      opponent: m.opponent ?? '',
      is_home: !!m.is_home,
      status: m.status ?? 'upcoming',
      our_score: m.our_score ?? '',
      their_score: m.their_score ?? '',
      location: m.location ?? '',
    });
    setScorers(
      (m.scorers || []).map((s) => ({ player_name: s.player_name, goals: s.goals })).length
        ? m.scorers.map((s) => ({ player_name: s.player_name, goals: s.goals }))
        : [{ player_name: '', goals: 1 }]
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setScorers([]);
  }

  function addScorerRow() {
    setScorers([...scorers, { player_name: '', goals: 1 }]);
  }

  function updateScorerRow(index, field, value) {
    const next = [...scorers];
    next[index] = { ...next[index], [field]: value };
    setScorers(next);
  }

  function removeScorerRow(index) {
    setScorers(scorers.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    if (!form.opponent) {
      setMsg({ type: 'error', text: "Il nome dell'avversario è obbligatorio." });
      return;
    }
    if (form.status === 'played' && (form.our_score === '' || form.their_score === '')) {
      setMsg({ type: 'error', text: 'Inserisci il risultato per una partita giocata.' });
      return;
    }

    const payload = { ...form, scorers: form.status === 'played' ? scorers : [] };
    const url = editingId ? `/api/matches/${editingId}` : '/api/matches';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMsg({ type: 'ok', text: editingId ? 'Partita aggiornata.' : 'Partita aggiunta.' });
      cancelEdit();
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg({ type: 'error', text: data.error || 'Errore durante il salvataggio.' });
    }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questa partita? Verranno rimossi anche i marcatori collegati.')) return;
    const res = await fetch(`/api/matches/${id}`, { method: 'DELETE' });
    if (res.ok) {
      load();
    } else {
      setMsg({ type: 'error', text: 'Errore durante l\'eliminazione.' });
    }
  }

  return (
    <div>
      <div className="admin-card">
        <h3>{editingId ? 'Modifica partita' : 'Aggiungi partita'}</h3>
        {msg && <div className={`admin-msg ${msg.type === 'error' ? 'error' : ''}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Giornata</label>
              <input
                type="number"
                value={form.giornata}
                onChange={(e) => setForm({ ...form, giornata: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Avversario</label>
              <input
                type="text"
                value={form.opponent}
                onChange={(e) => setForm({ ...form, opponent: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Stato</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="upcoming">Da giocare</option>
                <option value="played">Giocata</option>
              </select>
            </div>
            <div className="form-field checkbox">
              <input
                type="checkbox"
                id="is_home"
                checked={form.is_home}
                onChange={(e) => setForm({ ...form, is_home: e.target.checked })}
              />
              <label htmlFor="is_home" style={{ marginBottom: 0 }}>
                Partita in casa
              </label>
            </div>
            <div className="form-field">
              <label>Data</label>
              <input
                type="date"
                value={form.match_date}
                onChange={(e) => setForm({ ...form, match_date: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Ora</label>
              <input
                type="time"
                value={form.match_time}
                onChange={(e) => setForm({ ...form, match_time: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Luogo (opzionale)</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          {form.status === 'played' && (
            <>
              <div className="form-grid">
                <div className="form-field">
                  <label>Gol La Marina</label>
                  <input
                    type="number"
                    min="0"
                    value={form.our_score}
                    onChange={(e) => setForm({ ...form, our_score: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Gol avversario</label>
                  <input
                    type="number"
                    min="0"
                    value={form.their_score}
                    onChange={(e) => setForm({ ...form, their_score: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: 8 }}>
                <label>Marcatori (La Marina)</label>
              </div>
              <div className="scorers-editor">
                {scorers.map((s, i) => (
                  <div className="scorer-row" key={i}>
                    <input
                      type="text"
                      placeholder="Nome giocatore"
                      value={s.player_name}
                      onChange={(e) => updateScorerRow(i, 'player_name', e.target.value)}
                    />
                    <input
                      className="goals"
                      type="number"
                      min="1"
                      placeholder="Gol"
                      value={s.goals}
                      onChange={(e) => updateScorerRow(i, 'goals', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-admin danger small"
                      onClick={() => removeScorerRow(i)}
                    >
                      Rimuovi
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-admin secondary small" onClick={addScorerRow}>
                  + Aggiungi marcatore
                </button>
              </div>
            </>
          )}

          <div className="admin-row-actions">
            <button className="btn-admin" type="submit">
              {editingId ? 'Salva modifiche' : 'Aggiungi partita'}
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
        <h3>Calendario attuale</h3>
        {loading ? (
          <p>Caricamento…</p>
        ) : matches.length === 0 ? (
          <p>Nessuna partita inserita.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>G.</th>
                <th>Partita</th>
                <th>Risultato</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id}>
                  <td>{m.giornata ?? '-'}</td>
                  <td>{m.is_home ? `La Marina - ${m.opponent}` : `${m.opponent} - La Marina`}</td>
                  <td>
                    {m.status === 'played' ? `${m.our_score}-${m.their_score}` : 'Da giocare'}
                  </td>
                  <td>{m.match_date || '-'}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn-admin secondary small" onClick={() => startEdit(m)}>
                        Modifica
                      </button>
                      <button className="btn-admin danger small" onClick={() => handleDelete(m.id)}>
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
