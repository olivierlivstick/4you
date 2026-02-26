import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getBrands, createBrand, updateBrand, deleteBrand, uploadImage, getTestLogs, deleteTestLog } from '../api/client';

const PASSWORD = '123456';

function toCard(b) {
  return { id: b.id, title: b.name, description: b.description, color: b.color, photo: b.photo || '', category: b.category || '' };
}
function toApi(form) {
  return { name: form.title, description: form.description, color: form.color, category: form.category, photo: form.photo || '' };
}

const EMPTY_FORM = { title: '', description: '', color: '#6C3AED', photo: '', category: '' };

function fieldClass(hasError) {
  return [
    'w-full px-4 py-3 rounded-xl text-sm transition-all text-slate-800 placeholder-slate-400 bg-white shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-purple-400/30',
    hasError
      ? 'border-2 border-red-400'
      : 'border border-slate-200 hover:border-purple-300 focus:border-purple-400',
  ].join(' ');
}

function Label({ children }) {
  return <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{children}</label>;
}

// ── Password gate ──────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const { t } = useTranslation();
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === PASSWORD) {
      onAuth();
    } else {
      setError(t('admin.wrong_password'));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #fdfbfb 0%, #ebedee 100%)' }}>
      <form
        onSubmit={handleSubmit}
        className={`relative w-full max-w-sm rounded-3xl p-8 bg-white shadow-sm border border-slate-100 ${shake ? 'animate-bounce' : ''}`}
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 8px 24px rgba(108,58,237,0.25)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-800 text-center mb-1">{t('admin.title')}</h1>
        <p className="text-xs text-slate-400 text-center mb-7">{t('admin.subtitle_login')}</p>

        <div className="mb-4">
          <Label>{t('admin.password_label')}</Label>
          <input
            type="password"
            placeholder={t('admin.password_placeholder')}
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(''); }}
            autoFocus
            className={fieldClass(error)}
          />
          {error && <p className="text-xs mt-1.5 text-red-500 font-medium">{error}</p>}
        </div>

        <button type="submit"
          className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 6px 20px rgba(108,58,237,0.25)' }}>
          {t('admin.login_btn')}
        </button>
      </form>
    </div>
  );
}

// ── Card form (add / edit) ─────────────────────────────────
function CardForm({ initial, onSave, onCancel }) {
  const { t } = useTranslation();
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
      // silently ignore
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
    if (!form.title.trim()) errs.title = t('admin.cards.field_title_error');
    if (!form.description.trim()) errs.description = t('admin.cards.field_description_error');
    if (!form.color) errs.color = t('admin.cards.field_color_error');
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit}
      className="rounded-3xl p-6 mb-6 bg-white shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800 mb-5">
        {initial ? t('admin.cards.form_edit') : t('admin.cards.form_new')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>{t('admin.cards.field_title')}</Label>
          <input type="text" placeholder="ex: Netflix" value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className={fieldClass(errors.title)} />
          {errors.title && <p className="text-xs mt-1 text-red-500 font-medium">{errors.title}</p>}
        </div>

        <div>
          <Label>{t('admin.cards.field_category')}</Label>
          <input type="text" placeholder={t('admin.cards.field_category_placeholder')} value={form.category || ''}
            onChange={(e) => set('category', e.target.value)}
            className={fieldClass(false)} />
        </div>

        <div className="sm:col-span-2">
          <Label>{t('admin.cards.field_description')}</Label>
          <textarea rows={2} placeholder={t('admin.cards.field_description_placeholder')} value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={`${fieldClass(errors.description)} resize-none`} />
          {errors.description && <p className="text-xs mt-1 text-red-500 font-medium">{errors.description}</p>}
        </div>

        <div>
          <Label>{t('admin.cards.field_color')}</Label>
          <div className="flex items-center gap-3">
            <input type="color" value={form.color}
              onChange={(e) => set('color', e.target.value)}
              className="w-12 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-sm" />
            <input type="text" value={form.color} placeholder="#6C3AED"
              onChange={(e) => set('color', e.target.value)}
              className={`${fieldClass(errors.color)} flex-1 font-mono text-xs`} />
            <div className="w-8 h-8 rounded-xl flex-shrink-0 border border-slate-200 shadow-sm" style={{ backgroundColor: form.color }} />
          </div>
          {errors.color && <p className="text-xs mt-1 text-red-500 font-medium">{errors.color}</p>}
        </div>

        <div>
          <Label>{t('admin.cards.field_image')}</Label>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 shadow-sm"
              style={{ background: form.photo ? undefined : form.color }}>
              {form.photo
                ? <img src={form.photo} alt="" className="w-full h-full object-cover" />
                : <span className="text-white font-bold text-lg">{form.title?.[0] || '?'}</span>
              }
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center gap-2 border border-slate-200 bg-white shadow-sm text-slate-600">
                {uploading ? (
                  <><div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" /> {t('admin.cards.uploading')}</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> {t('admin.cards.upload_btn')}</>
                )}
              </button>
              {form.photo && (
                <button type="button" onClick={() => set('photo', '')}
                  className="text-xs text-left text-red-400 hover:text-red-500 transition-colors font-medium">
                  {t('admin.cards.remove_image')}
                </button>
              )}
            </div>
          </div>
          <p className="text-xs mt-2 text-slate-400">{t('admin.cards.image_hint')}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <button type="submit"
          className="px-5 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 4px 14px rgba(108,58,237,0.25)' }}>
          {initial ? t('admin.cards.save_btn') : t('admin.cards.add_card_btn')}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-2xl font-semibold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">
          {t('admin.cards.cancel')}
        </button>
      </div>
    </form>
  );
}

// ── Card row ───────────────────────────────────────────────
function CardRow({ card, onEdit, onDelete }) {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200">
      <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-white text-lg overflow-hidden shadow-sm"
        style={{ background: card.photo ? undefined : card.color, boxShadow: `0 4px 12px ${card.color}30` }}>
        {card.photo
          ? <img src={card.photo} alt={card.title} className="w-full h-full object-cover" />
          : card.title[0]
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-slate-800 text-sm">{card.title}</span>
          {card.category && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}>
              {card.category}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate">{card.description}</p>
      </div>

      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <div className="w-5 h-5 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: card.color }} />
        <span className="text-xs font-mono text-slate-400">{card.color}</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {confirmDelete ? (
          <>
            <button onClick={() => onDelete(card.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all">
              {t('admin.cards.confirm')}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">
              {t('admin.cards.cancel')}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onEdit(card)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600 shadow-sm">
              {t('admin.cards.edit')}
            </button>
            <button onClick={() => setConfirmDelete(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 bg-red-50 border border-red-100 hover:bg-red-100 transition-all">
              {t('admin.cards.delete')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Log row ────────────────────────────────────────────────
function LogRow({ log, onDelete }) {
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState(false);
  const date = new Date(log.created_at);
  const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-sm">
      {/* Date */}
      <div className="text-xs text-slate-400 whitespace-nowrap">
        <p className="font-semibold text-slate-600">{dateStr}</p>
        <p>{timeStr}</p>
      </div>

      {/* Carte */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100"
          style={{ background: log.brand_photo ? undefined : log.brand_color }}>
          {log.brand_photo
            ? <img src={log.brand_photo} alt="" className="w-full h-full object-cover" />
            : <span className="text-white font-bold text-xs">{log.brand_name?.[0]}</span>
          }
        </div>
        <span className="font-semibold text-slate-700 truncate">{log.brand_name}</span>
      </div>

      {/* Envoyeur */}
      <div className="min-w-0">
        <p className="font-semibold text-slate-700 truncate">{[log.sender_name, log.sender_lastname].filter(Boolean).join(' ') || '—'}</p>
        <p className="text-xs text-slate-400 truncate">{log.sender_email}</p>
      </div>

      {/* Destinataire */}
      <div className="min-w-0">
        <p className="font-semibold text-slate-700 truncate">{[log.recipient_name, log.recipient_lastname].filter(Boolean).join(' ') || '—'}</p>
        <p className="text-xs text-slate-400 truncate">{log.recipient_email}</p>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0">
        {confirm ? (
          <div className="flex items-center gap-2">
            <button onClick={() => onDelete(log.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all">
              {t('admin.logs.confirm')}
            </button>
            <button onClick={() => setConfirm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">
              {t('admin.logs.cancel')}
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 bg-red-50 border border-red-100 hover:bg-red-100 transition-all">
            {t('admin.logs.delete')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-lg border ${
      toast.type === 'error'
        ? 'bg-red-50 border-red-200 text-red-600'
        : 'bg-green-50 border-green-200 text-green-700'
    }`}>
      <span>{toast.type === 'error' ? '✕' : '✓'}</span>
      {toast.message}
    </div>
  );
}

// ── Main back office ───────────────────────────────────────
export default function BackOfficePage() {
  const { t } = useTranslation();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('cartes');

  // Onglet cartes
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Onglet connexions
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  const loadBrands = useCallback(() => {
    setLoading(true);
    getBrands()
      .then((brands) => setCards(brands.map(toCard)))
      .catch(() => showToast(t('admin.logs.toast_error_cards'), 'error'))
      .finally(() => setLoading(false));
  }, [t]);

  const loadLogs = useCallback(() => {
    setLogsLoading(true);
    getTestLogs()
      .then(setLogs)
      .catch(() => showToast(t('admin.logs.toast_error_logs'), 'error'))
      .finally(() => setLogsLoading(false));
  }, [t]);

  useEffect(() => {
    if (authenticated) { loadBrands(); loadLogs(); }
  }, [authenticated, loadBrands, loadLogs]);

  if (!authenticated) return <PasswordGate onAuth={() => setAuthenticated(true)} />;

  async function handleAdd(form) {
    try {
      const brand = await createBrand(toApi(form));
      setCards((c) => [...c, toCard(brand)]);
      setShowAddForm(false);
      showToast(t('admin.logs.toast_added', { name: brand.name }));
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function handleEdit(form) {
    try {
      const brand = await updateBrand(editingCard.id, toApi(form));
      setCards((c) => c.map((card) => card.id === brand.id ? toCard(brand) : card));
      setEditingCard(null);
      showToast(t('admin.logs.toast_updated', { name: brand.name }));
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function handleDelete(id) {
    try {
      const { deleted } = await deleteBrand(id);
      setCards((c) => c.filter((card) => card.id !== id));
      showToast(t('admin.logs.toast_deleted_brand', { name: deleted.name }));
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function handleDeleteLog(id) {
    try {
      await deleteTestLog(id);
      setLogs((l) => l.filter((log) => log.id !== id));
      showToast(t('admin.logs.toast_deleted'));
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  return (
    <div className="w-full min-h-screen px-4 py-8 sm:px-8 sm:py-12"
      style={{ background: 'linear-gradient(160deg, #fdfbfb 0%, #ebedee 100%)' }}>
      <Toast toast={toast} />

      {/* Page header */}
      <div className="flex items-center justify-between mb-8 px-6 py-5 rounded-3xl bg-white shadow-sm border border-slate-100 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-slate-800 text-lg">{t('admin.title')}</p>
            <p className="text-sm text-slate-400">{t('admin.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setAuthenticated(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t('admin.logout')}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'cartes', label: t('admin.tabs.cards'), count: cards.length },
            { key: 'connexions', label: t('admin.tabs.logs'), count: logs.length },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all"
              style={activeTab === key
                ? { background: 'linear-gradient(135deg, #6C3AED, #EC4899)', color: 'white', boxShadow: '0 4px 14px rgba(108,58,237,0.25)' }
                : { background: 'white', color: '#64748b', border: '1px solid #e2e8f0' }
              }>
              {label}
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={activeTab === key ? { background: 'rgba(255,255,255,0.25)' } : { background: '#f1f5f9', color: '#94a3b8' }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Onglet Cartes ── */}
        {activeTab === 'cartes' && (
          <>
            {showAddForm && <CardForm onSave={handleAdd} onCancel={() => setShowAddForm(false)} />}
            {editingCard && <CardForm initial={editingCard} onSave={handleEdit} onCancel={() => setEditingCard(null)} />}

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1 text-purple-500">{t('admin.cards.tag')}</p>
                <h2 className="text-lg font-extrabold text-slate-800">{t('admin.cards.title')}</h2>
              </div>
              {!showAddForm && !editingCard && (
                <button onClick={() => { setShowAddForm(true); setEditingCard(null); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #6C3AED, #EC4899)', boxShadow: '0 4px 14px rgba(108,58,237,0.25)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('admin.cards.add_btn')}
                </button>
              )}
            </div>

            <div className="h-px bg-slate-200 mb-5" />

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 rounded-full border-2 border-slate-200 border-t-purple-500 animate-spin" />
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-white border border-dashed border-slate-200">
                <p className="text-sm text-slate-400">{t('admin.cards.empty')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cards.map((card) => (
                  <CardRow key={card.id} card={card}
                    onEdit={(c) => { setEditingCard(c); setShowAddForm(false); }}
                    onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Onglet Connexions ── */}
        {activeTab === 'connexions' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1 text-purple-500">{t('admin.logs.tag')}</p>
                <h2 className="text-lg font-extrabold text-slate-800">{t('admin.logs.title')}</h2>
              </div>
              <button onClick={loadLogs}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('admin.logs.refresh')}
              </button>
            </div>

            {/* En-têtes colonnes */}
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-5 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>{t('admin.logs.col_date')}</span>
              <span>{t('admin.logs.col_card')}</span>
              <span>{t('admin.logs.col_sender')}</span>
              <span>{t('admin.logs.col_recipient')}</span>
              <span />
            </div>

            <div className="h-px bg-slate-200 mb-4" />

            {logsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 rounded-full border-2 border-slate-200 border-t-purple-500 animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-white border border-dashed border-slate-200">
                <p className="text-sm text-slate-400">{t('admin.logs.empty')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {logs.map((log) => (
                  <LogRow key={log.id} log={log} onDelete={handleDeleteLog} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
