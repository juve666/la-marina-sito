'use client';

import { useEffect, useState } from 'react';

const EMPTY = { number: '', name: '', role: '', sort_order: '', photo_url: '' };

export default function PlayersManager() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/players');
    const data = await res.json();
    setPlayers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'players');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setForm((f) => ({ ...f, photo_url: data.url }));
      } else {
        setMsg({ type: 'error', text: data.error || 'Errore durante il caricamento della foto.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Errore di connessione durante il caricamento.' });
    } finally {
      setUploading(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      number: p.number ?? '',
      name: p.name ?? '',
      role: p.role ?? '',
      sort_order: p.sort_order ?? '',
      photo_url: p.photo_url ?? '',
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
    if (!form.name || !form.role) {
      setMsg({ type: 'error', text: 'Nome e ruolo sono obbligatori.' });
      return;
    }
    const url = editingId ? `/api/players/${editingId}` : '/api/players';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg({ type: 'ok', text: editingId ? 'Giocatore aggiornato.' : 'Giocatore aggiunto.' });
      cancelEdit();
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg({ type: 'error', text: data.error || 'Errore durante il salvataggio.' });
    }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo giocatore?')) return;
    const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
    if (res.ok) {
      load();
    } else {
      setMsg({ type: 'error', text: 'Errore durante l\'eliminazione.' });
    }
  }

  return (
    <div>
      <div className="admin-card">
        <h3>{editingId ? 'Modifica giocatore' : 'Aggiungi giocatore'}</h3>
        {msg && <div className={`admin-msg ${msg.type === 'error' ? 'error' : ''}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Numero maglia</label>
              <input
                type="number"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Nome e cognome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Ruolo</label>
              <input
                type="text"
                placeholder="Es. Portiere, Pivot, Ala..."
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
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
            <div className="form-field">
              <label>Foto (opzionale)</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={uploading} />
              {uploading && <span style={{ fontSize: 12, color: 'var(--sub)' }}>Caricamento…</span>}
              {form.photo_url && !uploading && (
                <img
                  src={form.photo_url}
                  alt="Anteprima"
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', marginTop: 6 }}
                />
              )}
            </div>
          </div>
          <div className="admin-row-actions">
            <button className="btn-admin" type="submit">
              {editingId ? 'Salva modifiche' : 'Aggiungi giocatore'}
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
        <h3>Rosa attuale</h3>
        {loading ? (
          <p>Caricamento…</p>
        ) : players.length === 0 ? (
          <p>Nessun giocatore inserito.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>N.</th>
                <th>Nome</th>
                <th>Ruolo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.photo_url ? (
                      <img
                        src={p.photo_url}
                        alt=""
                        style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      <span style={{ color: 'var(--sub)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>{p.number ?? '-'}</td>
                  <td>{p.name}</td>
                  <td>{p.role}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn-admin secondary small" onClick={() => startEdit(p)}>
                        Modifica
                      </button>
                      <button className="btn-admin danger small" onClick={() => handleDelete(p.id)}>
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
