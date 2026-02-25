import { useState, useEffect, useCallback, useRef } from 'react';
import { getBrands, createBrand, updateBrand, deleteBrand, uploadImage } from '../api/client';

const PASSWORD = '123456';

// Map API brand → UI card
function toCard(b) {
  return { id: b.id, title: b.name, description: b.description, color: b.color, photo: b.photo || '', category: b.category || '' };
}
// Map UI form → API body
function toApi(form) {
  return { name: form.title, description: form.description, color: form.color, category: form.category, photo: form.photo || '' };
}

const EMPTY_FORM = { title: '', description: '', color: '#6C3AED', photo: '', category: '' };

// ── Shared style helpers ───────────────────────────────────
const inputStyle = (error) => ({
  background: error ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.35)',
  border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.25)'}`,
  color: 'white',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
});

function Label({ children }) {
  return <label className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{children}</label>;
}

// ── Password gate ──────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === PASSWORD) {
      onAuth();
    } else {
      setError('Mot de passe incorrect');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0F0C29 0%, #1a1545 50%, #1E1B4B 100%)' }}
    >
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(108,58,237,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`relative w-full max-w-sm rounded-2xl p-8 ${shake ? 'animate-bounce' : ''}`}
        style={{
          background: 'linear-gradient(145deg, #1E1B4B, #2D1B69)',
          border: '1px solid rgba(168,85,247,0.3)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 8px 24px rgba(108,58,237,0.4)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-white text-center mb-1">Back office</h1>
        <p className="text-xs text-center mb-7" style={{ color: 'rgba(255,255,255,0.35)' }}>Accès administrateur</p>

        <div className="mb-4">
          <Label>Mot de passe</Label>
          <input
            type="password"
            placeholder="••••••"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(''); }}
            autoFocus
            style={inputStyle(error)}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; }}
            onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.25)'; }}
          />
          {error && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 6px 20px rgba(108,58,237,0.4)' }}
        >
          Accéder
        </button>
      </form>
    </div>
  );
}

// ── Card form (add / edit) ─────────────────────────────────
function CardForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, photo: url }));
    } catch {
      // silently ignore upload error
    } finally {
      setUploading(false);
    }
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Le titre est obligatoire';
    if (!form.description.trim()) errs.description = 'La description est obligatoire';
    if (!form.color) errs.color = 'La couleur est obligatoire';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 mb-6"
      style={{
        background: 'linear-gradient(145deg, #1E1B4B, #2D1B69)',
        border: '1px solid rgba(168,85,247,0.4)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <h3 className="text-base font-bold text-white mb-5">
        {initial ? 'Modifier la carte' : 'Nouvelle carte'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Titre *</Label>
          <input
            type="text" placeholder="ex: Netflix" value={form.title}
            onChange={(e) => set('title', e.target.value)}
            style={inputStyle(errors.title)}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.title ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.25)'; }}
          />
          {errors.title && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.title}</p>}
        </div>

        <div>
          <Label>Catégorie</Label>
          <input
            type="text" placeholder="ex: Streaming" value={form.category || ''}
            onChange={(e) => set('category', e.target.value)}
            style={inputStyle(false)}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(168,85,247,0.25)'; }}
          />
        </div>

        <div className="sm:col-span-2">
          <Label>Description *</Label>
          <textarea
            rows={2} placeholder="Courte description de l'enseigne…" value={form.description}
            onChange={(e) => set('description', e.target.value)}
            style={{ ...inputStyle(errors.description), resize: 'vertical' }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.description ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.25)'; }}
          />
          {errors.description && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.description}</p>}
        </div>

        <div>
          <Label>Couleur primaire *</Label>
          <div className="flex items-center gap-3">
            <input
              type="color" value={form.color}
              onChange={(e) => set('color', e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border-0 p-0.5"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168,85,247,0.25)' }}
            />
            <input
              type="text" value={form.color} placeholder="#6C3AED"
              onChange={(e) => set('color', e.target.value)}
              style={{ ...inputStyle(errors.color), width: 'auto', flex: 1, fontFamily: 'monospace', fontSize: '12px' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; }}
              onBlur={(e) => { e.target.style.borderColor = errors.color ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.25)'; }}
            />
            {/* Live swatch */}
            <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-white/10" style={{ backgroundColor: form.color }} />
          </div>
          {errors.color && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.color}</p>}
        </div>

        <div>
          <Label>Image de la carte</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-3">
            {/* Preview */}
            <div
              className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/10"
              style={{ background: form.photo ? undefined : form.color }}
            >
              {form.photo
                ? <img src={form.photo} alt="" className="w-full h-full object-cover" />
                : <span className="text-white font-bold text-lg">{form.title?.[0] || '?'}</span>
              }
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 flex items-center gap-2"
                style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}
              >
                {uploading ? (
                  <><div className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(192,132,252,0.3)', borderTopColor: '#c084fc' }} /> Envoi…</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Choisir une image</>
                )}
              </button>
              {form.photo && (
                <button
                  type="button"
                  onClick={() => set('photo', '')}
                  className="text-xs text-left transition-all hover:opacity-80"
                  style={{ color: 'rgba(239,68,68,0.7)' }}
                >
                  Supprimer l'image
                </button>
              )}
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Sans image, la couleur primaire est utilisée</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 4px 14px rgba(108,58,237,0.4)' }}
        >
          {initial ? 'Enregistrer' : 'Ajouter la carte'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// ── Card row ───────────────────────────────────────────────
function CardRow({ card, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all group"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Color / photo thumbnail */}
      <div
        className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-white text-lg overflow-hidden"
        style={{
          background: card.photo ? undefined : card.color,
          boxShadow: `0 4px 12px ${card.color}50`,
        }}
      >
        {card.photo
          ? <img src={card.photo} alt={card.title} className="w-full h-full object-cover" />
          : card.title[0]
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-white text-sm">{card.title}</span>
          {card.category && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${card.color}20`, color: card.color, border: `1px solid ${card.color}40` }}
            >
              {card.category}
            </span>
          )}
        </div>
        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{card.description}</p>
      </div>

      {/* Color swatch */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <div className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: card.color }} />
        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.color}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {confirmDelete ? (
          <>
            <button
              onClick={() => onDelete(card.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#dc2626' }}
            >
              Confirmer
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(card)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}
            >
              Modifier
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main back office ───────────────────────────────────────
// ── Toast notification ─────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl"
      style={{
        background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
        border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
        color: toast.type === 'error' ? '#fca5a5' : '#86efac',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span>{toast.type === 'error' ? '✕' : '✓'}</span>
      {toast.message}
    </div>
  );
}

export default function BackOfficePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  const loadBrands = useCallback(() => {
    setLoading(true);
    getBrands()
      .then((brands) => setCards(brands.map(toCard)))
      .catch(() => showToast('Impossible de charger les enseignes', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (authenticated) loadBrands();
  }, [authenticated, loadBrands]);

  if (!authenticated) return <PasswordGate onAuth={() => setAuthenticated(true)} />;

  async function handleAdd(form) {
    try {
      const brand = await createBrand(toApi(form));
      setCards((c) => [...c, toCard(brand)]);
      setShowAddForm(false);
      showToast(`"${brand.name}" ajoutée avec succès`);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function handleEdit(form) {
    try {
      const brand = await updateBrand(editingCard.id, toApi(form));
      setCards((c) => c.map((card) => card.id === brand.id ? toCard(brand) : card));
      setEditingCard(null);
      showToast(`"${brand.name}" mise à jour`);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function handleDelete(id) {
    try {
      const { deleted } = await deleteBrand(id);
      setCards((c) => c.filter((card) => card.id !== id));
      showToast(`"${deleted.name}" supprimée`);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  return (
    <div
      className="w-full min-h-screen px-6 py-8"
      style={{ background: 'linear-gradient(160deg, #0F0C29 0%, #1a1545 40%, #1E1B4B 100%)' }}
    >
      <Toast toast={toast} />
      {/* Page header */}
      <div
        className="flex items-center justify-between mb-8 px-6 py-4 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #1E1B4B, #2D1B69)', border: '1px solid rgba(168,85,247,0.2)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 18, height: 18 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-sm">Back office</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Administration des cartes cadeaux</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats badge */}
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}
          >
            {cards.length} carte{cards.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setAuthenticated(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {showAddForm && (
        <CardForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      {editingCard && (
        <CardForm
          initial={editingCard}
          onSave={handleEdit}
          onCancel={() => setEditingCard(null)}
        />
      )}

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#A855F7' }}>Catalogue</p>
          <h2 className="text-lg font-bold text-white">Cartes disponibles</h2>
        </div>
        {!showAddForm && !editingCard && (
          <button
            onClick={() => { setShowAddForm(true); setEditingCard(null); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 4px 14px rgba(108,58,237,0.35)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une carte
          </button>
        )}
      </div>

      {/* Gradient separator */}
      <div className="h-px mb-5" style={{ background: 'linear-gradient(90deg, #6C3AED40, #EC489940, transparent)' }} />

      {/* Cards list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(168,85,247,0.3)', borderTopColor: '#A855F7' }} />
        </div>
      ) : cards.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucune carte. Commencez par en ajouter une.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {cards.map((card) => (
            <CardRow
              key={card.id}
              card={card}
              onEdit={(c) => { setEditingCard(c); setShowAddForm(false); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
