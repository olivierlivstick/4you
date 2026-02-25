import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { getBrand, createOrder, payOrder } from '../api/client';
import { formatAmount } from '../utils/formatters';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRESETS = [10, 25, 50, 75, 100];
const MAX_MSG = 200;

// ── Dark-theme helpers ─────────────────────────────────────
function darkFieldClass(hasError) {
  return [
    'w-full px-4 py-3 rounded-xl text-sm transition-all',
    'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
    hasError
      ? 'border border-red-500/40 bg-red-900/20 text-white'
      : 'border border-purple-500/20 bg-black/30 text-white',
  ].join(' ');
}

// ── Step card wrapper ──────────────────────────────────────
function StepCard({ index, title, enabled, completed, summary, onEdit, children, brand }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col"
      style={
        enabled
          ? {
              background: 'linear-gradient(145deg, #1E1B4B 0%, #2D1B69 100%)',
              border: '1px solid rgba(168,85,247,0.3)',
              boxShadow: '0 0 0 1px rgba(168,85,247,0.08), 0 8px 32px rgba(0,0,0,0.35)',
            }
          : {
              background: '#13112a',
              border: '1px solid rgba(255,255,255,0.05)',
            }
      }
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ opacity: enabled ? 1 : 0.3 }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Step number bubble */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={
              completed
                ? { background: 'linear-gradient(135deg, #6C3AED, #EC4899)', color: 'white' }
                : enabled
                ? { background: brand.color, color: 'white' }
                : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }
            }
          >
            {completed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <span className="font-semibold text-base truncate" style={{ color: enabled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.25)' }}>
            {title}
          </span>
          {completed && summary && (
            <span className="text-xs font-medium truncate hidden sm:inline" style={{ color: brand.color }}>
              — {summary}
            </span>
          )}
        </div>
        {completed && onEdit && (
          <button
            className="text-xs underline transition-colors flex-shrink-0 ml-2"
            style={{ color: 'rgba(168,85,247,0.7)' }}
            onMouseEnter={(e) => (e.target.style.color = 'rgba(244,114,182,0.9)')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(168,85,247,0.7)')}
            onClick={onEdit}
          >
            Modifier
          </button>
        )}
      </div>

      {/* Content */}
      {enabled && (
        <div className="px-6 pb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function PersonalizePage() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const store = useOrderStore();

  const [brand, setBrandData] = useState(store.selectedBrand);
  const [loadingBrand, setLoadingBrand] = useState(!store.selectedBrand);

  const [activeStep, setActiveStep] = useState(0);
  const [amountDone, setAmountDone] = useState(store.amount ? { amount: store.amount } : null);
  const [recipientDone, setRecipientDone] = useState(
    store.recipientName ? { senderEmail: store.senderEmail, email: store.recipientEmail, name: store.recipientName, message: store.personalMessage } : null
  );
  const [videoDone, setVideoDone] = useState(null);

  const [selectedPreset, setSelectedPreset] = useState(PRESETS.includes(store.amount) ? store.amount : null);
  const [customAmount, setCustomAmount] = useState(store.amount && !PRESETS.includes(store.amount) ? String(store.amount) : '');
  const [amountError, setAmountError] = useState('');

  const [senderEmail, setSenderEmail] = useState(store.senderEmail || '');
  const [recipientName, setRecipientName] = useState(store.recipientName || '');
  const [recipientEmail, setRecipientEmail] = useState(store.recipientEmail || '');
  const [personalMessage, setPersonalMessage] = useState(store.personalMessage || '');
  const [recipientErrors, setRecipientErrors] = useState({});

  const [hasVideo, setHasVideo] = useState(store.hasVideoMessage || false);
  const [videoRecorded, setVideoRecorded] = useState(store.videoRecorded || false);
  const [recording, setRecording] = useState(false);

  const [showRecap, setShowRecap] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const recapRef = useRef(null);

  useEffect(() => {
    if (!store.selectedBrand) {
      getBrand(brandId)
        .then((b) => { setBrandData(b); store.setBrand(b); setLoadingBrand(false); })
        .catch(() => navigate('/'));
    }
  }, [brandId]);

  if (loadingBrand || !brand) {
    return (
      <div className="flex items-center justify-center min-h-64" style={{ background: '#0F0C29' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(168,85,247,0.3)', borderTopColor: '#A855F7' }} />
      </div>
    );
  }

  const effectiveAmount = customAmount ? parseFloat(customAmount) : selectedPreset;

  function handleAmountNext() {
    if (!effectiveAmount || isNaN(effectiveAmount)) { setAmountError('Veuillez choisir ou saisir un montant'); return; }
    if (effectiveAmount < 5 || effectiveAmount > 500) { setAmountError('Le montant doit être entre 5 € et 500 €'); return; }
    setAmountError('');
    store.setAmount(effectiveAmount);
    setAmountDone({ amount: effectiveAmount });
    setActiveStep(1);
    setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  function handleRecipientNext() {
    const e = {};
    if (!senderEmail.trim()) e.senderEmail = 'Votre email est obligatoire';
    else if (!EMAIL_RE.test(senderEmail.trim())) e.senderEmail = 'Format email invalide';
    if (!recipientName.trim()) e.name = 'Le prénom est obligatoire';
    if (!recipientEmail.trim()) e.email = "L'email est obligatoire";
    else if (!EMAIL_RE.test(recipientEmail.trim())) e.email = 'Format email invalide';
    if (personalMessage.length > MAX_MSG) e.message = `Maximum ${MAX_MSG} caractères`;
    if (Object.keys(e).length > 0) { setRecipientErrors(e); return; }
    setRecipientErrors({});
    store.setRecipient({ senderEmail: senderEmail.trim(), email: recipientEmail.trim(), name: recipientName.trim(), message: personalMessage.trim() });
    setRecipientDone({ senderEmail: senderEmail.trim(), email: recipientEmail.trim(), name: recipientName.trim(), message: personalMessage.trim() });
    setShowRecap(true);
    setTimeout(() => recapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  function handleVideoNext() {
    store.setVideo({ hasVideoMessage: hasVideo, videoRecorded });
    setVideoDone({ hasVideoMessage: hasVideo, videoRecorded });
    setActiveStep(2);
    setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  function handleRecord() {
    setRecording(true);
    setTimeout(() => { setRecording(false); setVideoRecorded(true); }, 1800);
  }

  async function handlePay() {
    setPaying(true);
    setPayError('');
    try {
      const created = await createOrder({
        brand_id: brand.id,
        amount: amountDone.amount,
        sender_email: recipientDone.senderEmail,
        recipient_email: recipientDone.email,
        recipient_name: recipientDone.name,
        personal_message: recipientDone.message,
        has_video_message: videoDone.hasVideoMessage,
      });
      const paid = await payOrder(created.id);
      store.setPaidOrder(paid);
      navigate(`/confirmation/${paid.id}`);
    } catch (e) {
      setPayError(e.message || 'Erreur lors du paiement');
    } finally {
      setPaying(false);
    }
  }

  const amountSummary = amountDone ? formatAmount(amountDone.amount) : null;
  const recipientSummary = recipientDone ? `${recipientDone.name} · ${recipientDone.email}` : null;
  const videoSummary = videoDone
    ? videoDone.hasVideoMessage ? (videoDone.videoRecorded ? '🎥 Enregistré' : '🎥 Ajouté') : 'Sans vidéo'
    : null;

  return (
    <div
      className="w-full min-h-screen px-6 py-8"
      style={{ background: 'linear-gradient(160deg, #0F0C29 0%, #1a1545 40%, #1E1B4B 100%)' }}
    >
      {/* Brand strip */}
      <div
        className="relative flex items-center gap-4 px-6 py-4 rounded-2xl mb-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E1B4B, #2D1B69)', border: '1px solid rgba(168,85,247,0.2)' }}
      >
        {/* Brand color accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: brand.color }} />
        <div
          className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${brand.color}18, transparent)` }}
        />
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 relative z-10"
          style={{ backgroundColor: brand.color, boxShadow: `0 4px 16px ${brand.color}60` }}
        >
          {brand.name[0]}
        </div>
        <div className="relative z-10">
          <p className="font-bold text-white">{brand.name}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{brand.category}</p>
        </div>
        <div className="ml-auto relative z-10 flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: `${brand.color}25`, color: brand.color, border: `1px solid ${brand.color}40` }}>
            Personnalisation
          </span>
        </div>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

        {/* ── Step 1 : Montant ── */}
        <StepCard index={0} title="Montant" enabled={activeStep >= 0}
          completed={amountDone !== null && activeStep > 0} summary={amountSummary}
          onEdit={() => { setAmountDone(null); setActiveStep(0); setShowRecap(false); }} brand={brand}>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            {PRESETS.map((v) => {
              const isSelected = selectedPreset === v && !customAmount;
              return (
                <button
                  key={v}
                  onClick={() => { setSelectedPreset(v); setCustomAmount(''); setAmountError(''); }}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  style={
                    isSelected
                      ? { background: brand.color, color: 'white', boxShadow: `0 4px 14px ${brand.color}55`, border: `1px solid ${brand.color}` }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {formatAmount(v)}
                </button>
              );
            })}
          </div>

          {/* Custom amount */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Ou saisir un montant libre</label>
            <div className="relative">
              <input
                type="number" min={5} max={500} step={1} value={customAmount} placeholder="35"
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(null); setAmountError(''); }}
                className={darkFieldClass(false)}
                style={
                  customAmount
                    ? { background: `${brand.color}18`, border: `1px solid ${brand.color}60`, color: 'white' }
                    : {}
                }
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>€</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Entre 5 € et 500 €</p>
          </div>
          {amountError && <p className="text-xs mb-3" style={{ color: '#f87171' }}>{amountError}</p>}
          <NextButton onClick={handleAmountNext} brand={brand}>Suivant</NextButton>
        </StepCard>

        {/* ── Step 2 : Message vidéo ── */}
        <div ref={step2Ref} className="h-full">
          <StepCard index={1} title="Message vidéo" enabled={activeStep >= 1}
            completed={videoDone !== null && activeStep > 1} summary={videoSummary}
            onEdit={() => { setVideoDone(null); setActiveStep(1); setShowRecap(false); }} brand={brand}>

            {/* Toggle */}
            <label
              className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl transition-all mb-4"
              style={{
                background: hasVideo ? `${brand.color}15` : 'rgba(255,255,255,0.04)',
                border: hasVideo ? `1px solid ${brand.color}40` : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" className="sr-only" checked={hasVideo}
                  onChange={(e) => { setHasVideo(e.target.checked); if (!e.target.checked) setVideoRecorded(false); }} />
                <div
                  className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all"
                  style={hasVideo ? { backgroundColor: brand.color, borderColor: brand.color } : { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent' }}
                >
                  {hasVideo && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>Ajouter un message vidéo 🎥</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Accessible via QR code sur le voucher</p>
              </div>
            </label>

            {/* Player area — always rendered */}
            <div
              className="rounded-xl overflow-hidden mb-4 transition-opacity duration-300"
              style={{ opacity: hasVideo ? 1 : 0.35, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Viewfinder */}
              <div className="aspect-video relative flex items-center justify-center" style={{ background: '#08070f' }}>
                {/* Subtle grid */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {!hasVideo && (
                  <div className="flex flex-col items-center gap-2 relative z-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Activez l'option ci-dessus</span>
                  </div>
                )}

                {hasVideo && !recording && !videoRecorded && (
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ border: '2px dashed rgba(168,85,247,0.4)', background: 'rgba(168,85,247,0.08)' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(168,85,247,0.7)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Aperçu caméra</span>
                  </div>
                )}

                {hasVideo && recording && (
                  <>
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded px-2 py-0.5 z-10" style={{ background: '#dc2626' }}>
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-xs font-bold tracking-wide">REC</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <span className="w-5 h-5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Enregistrement en cours...</span>
                    </div>
                  </>
                )}

                {hasVideo && videoRecorded && !recording && (
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#4ade80' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#4ade80' }}>Vidéo enregistrée</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {videoRecorded ? 'Durée : ~15s' : 'Durée max : 30s'}
                </span>
                <button
                  onClick={videoRecorded ? () => setVideoRecorded(false) : handleRecord}
                  disabled={recording || !hasVideo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-30"
                  style={{ backgroundColor: videoRecorded ? '#374151' : brand.color }}
                >
                  {recording ? 'En cours...' : videoRecorded ? 'Refaire' : 'Enregistrer'}
                </button>
              </div>
            </div>

            <NextButton onClick={handleVideoNext} brand={brand}>Suivant</NextButton>
          </StepCard>
        </div>

        {/* ── Step 3 : Coordonnées ── */}
        <div ref={step3Ref} className="h-full">
          <StepCard index={2} title="Coordonnées" enabled={activeStep >= 2}
            completed={recipientDone !== null && activeStep > 2} summary={recipientSummary}
            onEdit={() => { setRecipientDone(null); setActiveStep(2); setShowRecap(false); }} brand={brand}>

            <div className="flex flex-col gap-3.5 mb-4">
              <DarkField label="Votre email *" error={recipientErrors.senderEmail}>
                <input type="email" placeholder="vous@exemple.fr" value={senderEmail}
                  onChange={(e) => { setSenderEmail(e.target.value); setRecipientErrors((p) => ({ ...p, senderEmail: '' })); }}
                  className={darkFieldClass(recipientErrors.senderEmail)} />
              </DarkField>

              <div className="flex items-center gap-2 my-0.5">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>Pour qui ?</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              </div>

              <DarkField label="Prénom du destinataire *" error={recipientErrors.name}>
                <input type="text" placeholder="Marie" value={recipientName}
                  onChange={(e) => { setRecipientName(e.target.value); setRecipientErrors((p) => ({ ...p, name: '' })); }}
                  className={darkFieldClass(recipientErrors.name)} />
              </DarkField>

              <DarkField label="Email du destinataire *" error={recipientErrors.email}>
                <input type="email" placeholder="marie@exemple.fr" value={recipientEmail}
                  onChange={(e) => { setRecipientEmail(e.target.value); setRecipientErrors((p) => ({ ...p, email: '' })); }}
                  className={darkFieldClass(recipientErrors.email)} />
              </DarkField>

              <DarkField
                label={<>Message personnel <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optionnel)</span></>}
                error={recipientErrors.message}
              >
                <textarea
                  rows={2} placeholder="Joyeux anniversaire !" value={personalMessage}
                  onChange={(e) => { setPersonalMessage(e.target.value); setRecipientErrors((p) => ({ ...p, message: '' })); }}
                  maxLength={MAX_MSG + 10}
                  className={`${darkFieldClass(recipientErrors.message)} resize-none`}
                />
                <span className="text-xs text-right mt-0.5" style={{ color: personalMessage.length > MAX_MSG ? '#f87171' : 'rgba(255,255,255,0.2)' }}>
                  {personalMessage.length}/{MAX_MSG}
                </span>
              </DarkField>
            </div>

            <NextButton onClick={handleRecipientNext} brand={brand}>Voir le récapitulatif</NextButton>
          </StepCard>
        </div>

        {/* ── Récapitulatif + paiement ── */}
        {showRecap && amountDone && recipientDone && videoDone && (
          <div
            ref={recapRef}
            className="col-span-1 md:col-span-3 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1E1B4B, #2D1B69)',
              border: '1px solid rgba(168,85,247,0.3)',
              boxShadow: '0 0 0 1px rgba(168,85,247,0.08), 0 16px 48px rgba(0,0,0,0.4)',
            }}
          >
            {/* Header band */}
            <div
              className="h-14 flex items-center justify-between px-6"
              style={{ backgroundColor: brand.color }}
            >
              <span className="text-white font-bold text-lg">{brand.name}</span>
              <span className="text-white/70 text-sm font-medium">Récapitulatif</span>
            </div>

            {/* Data rows */}
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
              <RecapRow label="Montant" value={formatAmount(amountDone.amount)} accent={brand.color} large />
              <RecapRow label="Message vidéo" value={videoDone.hasVideoMessage ? '🎥 Inclus' : '—'} accent={videoDone.hasVideoMessage ? brand.color : undefined} />
              <RecapRow label="De" value={recipientDone.senderEmail} />
              <RecapRow label="Pour" value={`${recipientDone.name} · ${recipientDone.email}`} />
              {recipientDone.message && (
                <div className="sm:col-span-2">
                  <RecapRow label="Message" value={`"${recipientDone.message}"`} italic />
                </div>
              )}
            </div>

            <div className="h-px mx-6" style={{ background: 'rgba(255,255,255,0.07)' }} />

            {payError && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {payError}
              </div>
            )}

            {/* Pay button */}
            <div className="px-6 py-6 flex flex-col gap-3">
              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base text-white transition-all active:scale-95 disabled:opacity-50"
                style={{
                  background: paying
                    ? brand.color
                    : `linear-gradient(135deg, ${brand.color} 0%, #EC4899 100%)`,
                  boxShadow: paying ? 'none' : `0 8px 24px ${brand.color}50`,
                }}
              >
                {paying ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    Payer {formatAmount(amountDone.amount)}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </>
                )}
              </button>
              <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Site de démonstration — aucun paiement réel effectué
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────
function NextButton({ children, onClick, brand }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
      style={{ backgroundColor: brand.color, boxShadow: `0 4px 14px ${brand.color}45` }}
    >
      {children}
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function DarkField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}
    </div>
  );
}

function RecapRow({ label, value, accent, italic, large }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
      <span
        className={large ? 'text-xl font-bold' : 'text-sm font-medium'}
        style={{ color: accent || (italic ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)'), fontStyle: italic ? 'italic' : 'normal' }}
      >
        {value}
      </span>
    </div>
  );
}
