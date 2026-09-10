'use client';

import { useEffect, useState } from 'react';

const EMPTY = { role: '', name: '', sort_order: '' };

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/staff');
    const data = await res.json();
    setStaff(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(s) {
    setEditingId(s.id);
    setForm({ role: s.role ?? '', name: s.name ?? '', sort_order: s.sort_order ?? '' });
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
      setMsg({ type: 'error', text: 'Ruolo e nome sono obbligatori.' });
      return;
    }
    const url = editingId ? `/api/staff/${editingId}` : '/api/staff';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg({ type: 'ok', text: editingId ? 'Aggiornato.' : 'Aggiunto.' });
      cancelEdit();
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg({ type: 'error', text: data.error || 'Errore durante il salvataggio.' });
    }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo membro dello staff?')) return;
    const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    if (res.ok) {
      load();
    } else {
      setMsg({ type: 'error', text: 'Errore durante l\'eliminazione.' });
    }
  }

  return (
    <div>
      <div className="admin-card">
        <h3>{editingId ? 'Modifica membro staff' : 'Aggiungi membro staff'}</h3>
        {msg && <div className={`admin-msg ${msg.type === 'error' ? 'error' : ''}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Ruolo</label>
              <input
                type="text"
                placeholder="Es. Presidente, Allenatore..."
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
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
        <h3>Dirigenza attuale</h3>
        {loading ? (
          <p>Caricamento…</p>
        ) : staff.length === 0 ? (
          <p>Nessun membro inserito.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ruolo</th>
                <th>Nome</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.role}</td>
                  <td>{s.name}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn-admin secondary small" onClick={() => startEdit(s)}>
                        Modifica
                      </button>
                      <button className="btn-admin danger small" onClick={() => handleDelete(s.id)}>
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
