import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderStore } from '../store/orderStore';
import { getBrand, createOrder, payOrder } from '../api/client';
import { formatAmount } from '../utils/formatters';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRESETS = [10, 25, 50, 75, 100];
const MAX_MSG = 200;

function darkFieldClass(hasError) {
  return [
    'w-full px-4 py-2 rounded-xl text-sm transition-all text-slate-800 placeholder-slate-400 bg-white shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
    hasError
      ? 'border-2 border-red-400 focus:border-red-500'
      : 'border border-slate-200 hover:border-primary-300 focus:border-primary-500',
  ].join(' ');
}

function StepCard({ index, title, enabled, completed, summary, onEdit, children, brand }) {
  return (
    <div
      className="rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col"
      style={
        enabled
          ? {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${brand.color}30`,
            boxShadow: `0 10px 40px -10px ${brand.color}20`,
          }
          : { background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0,0,0,0.05)' }
      }
    >
      <div className="flex items-center justify-between px-5 py-3" style={{ opacity: enabled ? 1 : 0.4 }}>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm"
            style={
              completed
                ? { background: `linear-gradient(135deg, ${brand.color}, #EC4899)`, color: 'white' }
                : enabled
                  ? { background: brand.color, color: 'white' }
                  : { background: '#e2e8f0', color: '#94a3b8' }
            }
          >
            {completed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <span className="font-bold text-lg truncate" style={{ color: enabled ? '#1e293b' : '#94a3b8' }}>
            {title}
          </span>
          {completed && summary && (
            <span className="text-sm font-semibold truncate hidden sm:inline" style={{ color: brand.color }}>
              — {summary}
            </span>
          )}
        </div>
        {completed && onEdit && (
          <button
            className="text-sm font-medium transition-colors flex-shrink-0 ml-2 hover:underline"
            style={{ color: brand.color }}
            onClick={onEdit}
          >
            Modifier
          </button>
        )}
      </div>

      {enabled && (
        <div className="px-5 pb-4 flex-1 flex flex-col" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="pt-3 flex-1 flex flex-col">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function PersonalizePage() {
  const { t } = useTranslation();
  const { brandId } = useParams();
  const navigate = useNavigate();
  const store = useOrderStore();

  const [brand, setBrandData] = useState(store.selectedBrand);
  const [loadingBrand, setLoadingBrand] = useState(!store.selectedBrand);

  const [parcours, setParcours] = useState('pre');

  const [activeStep, setActiveStep] = useState(0);
  const [step0Done, setStep0Done] = useState(null);
  const [step1Done, setStep1Done] = useState(null);

  // Step 0 — commande
  const [selectedPreset, setSelectedPreset] = useState(PRESETS.includes(store.amount) ? store.amount : 50);
  const [customAmount, setCustomAmount] = useState(store.amount && !PRESETS.includes(store.amount) ? String(store.amount) : '');
  const [senderName, setSenderName] = useState('Alice');
  const [senderLastName, setSenderLastName] = useState('Martin');
  const [senderEmail, setSenderEmail] = useState(store.senderEmail || 'alice.martin@exemple.fr');
  const [recipientName, setRecipientName] = useState(store.recipientName || 'Bob');
  const [recipientLastName, setRecipientLastName] = useState('Dupont');
  const [recipientEmail, setRecipientEmail] = useState(store.recipientEmail || 'bob.dupont@exemple.fr');
  const [personalMessage, setPersonalMessage] = useState(store.personalMessage || '');
  const [step0Errors, setStep0Errors] = useState({});

  // Step 1 — vidéo
  const [hasVideo, setHasVideo] = useState(store.hasVideoMessage || false);
  const [videoRecorded, setVideoRecorded] = useState(store.videoRecorded || false);
  const [recording, setRecording] = useState(false);

  // Step 2 — paiement
  const [cardName, setCardName] = useState('Olivier Adler');
  const [cardNumber, setCardNumber] = useState('1111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('01/26');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardErrors, setCardErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const [videoModalData, setVideoModalData] = useState(null);

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  function handleStep0Next() {
    const e = {};
    if (!effectiveAmount || isNaN(effectiveAmount)) e.amount = t('personalize.errors.amount_required');
    else if (effectiveAmount < 5 || effectiveAmount > 500) e.amount = t('personalize.errors.amount_range');
    if (!senderName.trim()) e.senderName = t('personalize.errors.firstname_required');
    if (!senderLastName.trim()) e.senderLastName = t('personalize.errors.lastname_required');
    if (!senderEmail.trim()) e.senderEmail = t('personalize.errors.email_required');
    else if (!EMAIL_RE.test(senderEmail.trim())) e.senderEmail = t('personalize.errors.email_invalid');
    if (!recipientName.trim()) e.name = t('personalize.errors.firstname_required');
    if (!recipientLastName.trim()) e.recipientLastName = t('personalize.errors.lastname_required');
    if (!recipientEmail.trim()) e.email = t('personalize.errors.email_required');
    else if (!EMAIL_RE.test(recipientEmail.trim())) e.email = t('personalize.errors.email_invalid');
    if (personalMessage.length > MAX_MSG) e.message = t('personalize.errors.message_max', { max: MAX_MSG });
    if (Object.keys(e).length > 0) { setStep0Errors(e); return; }
    setStep0Errors({});
    store.setAmount(effectiveAmount);
    store.setRecipient({ senderEmail: senderEmail.trim(), email: recipientEmail.trim(), name: recipientName.trim(), message: personalMessage.trim() });
    setStep0Done({ amount: effectiveAmount, senderName: senderName.trim(), senderLastName: senderLastName.trim(), senderEmail: senderEmail.trim(), email: recipientEmail.trim(), name: recipientName.trim(), recipientLastName: recipientLastName.trim(), message: personalMessage.trim() });
    if (parcours === 'post') {
      setActiveStep(2);
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    } else {
      setActiveStep(1);
      setTimeout(() => step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    }
  }

  function handleStep1Next() {
    store.setVideo({ hasVideoMessage: hasVideo, videoRecorded });
    setStep1Done({ hasVideoMessage: hasVideo, videoRecorded });
    setActiveStep(2);
    setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  function handleRecord() {
    setRecording(true);
    setTimeout(() => { setRecording(false); setVideoRecorded(true); }, 1800);
  }

  function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  async function handlePay() {
    const e = {};
    if (!cardName.trim()) e.cardName = t('personalize.errors.card_name');
    if (cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = t('personalize.errors.card_number');
    const parts = cardExpiry.split('/');
    const mm = parseInt(parts[0]);
    if (!parts[1] || isNaN(mm) || mm < 1 || mm > 12) e.cardExpiry = t('personalize.errors.card_expiry');
    if (!/^\d{3,4}$/.test(cardCvv)) e.cardCvv = t('personalize.errors.card_cvv');
    if (Object.keys(e).length > 0) { setCardErrors(e); return; }
    setCardErrors({});
    setPaying(true);
    setPayError('');
    try {
      const created = await createOrder({
        brand_id: brand.id,
        amount: step0Done.amount,
        sender_name: step0Done.senderName,
        sender_lastname: step0Done.senderLastName,
        sender_email: step0Done.senderEmail,
        recipient_email: step0Done.email,
        recipient_name: step0Done.name,
        recipient_lastname: step0Done.recipientLastName,
        personal_message: step0Done.message,
        has_video_message: step1Done?.hasVideoMessage ?? false,
      });
      const paid = await payOrder(created.id);
      store.setPaidOrder(paid);
      const orderData = { order: paid, brand, step0: step0Done, step1: step1Done };
      if (parcours === 'post') {
        setVideoModalData(orderData);
      } else {
        setVoucherData(orderData);
      }
    } catch (err) {
      setPayError(err.message || 'Erreur lors du paiement');
    } finally {
      setPaying(false);
    }
  }

  const step0Summary = step0Done ? `${formatAmount(step0Done.amount)} · ${step0Done.name}` : null;
  const step1Summary = step1Done
    ? step1Done.hasVideoMessage ? (step1Done.videoRecorded ? '🎥 Enregistré' : '🎥 Ajouté') : 'Sans vidéo'
    : null;

  return (
    <div className="w-full min-h-screen px-4 py-4 sm:px-8 sm:py-6"
      style={{ background: 'linear-gradient(160deg, #fdfbfb 0%, #ebedee 100%)' }}>

      {videoModalData && (
        <VideoRecordingModal
          data={videoModalData}
          onVideoRecorded={() => { setVoucherData(videoModalData); setVideoModalData(null); }}
        />
      )}

      {voucherData && (
        <VoucherModal
          data={voucherData}
          onClose={() => navigate(`/confirmation/${voucherData.order.id}`)}
        />
      )}

      {/* Image + sélecteur de parcours */}
      <div className="flex flex-col sm:flex-row items-center gap-5 mb-5 max-w-7xl mx-auto">

        {/* Image de la carte — moitié moins haute */}
        <div className="shrink-0 rounded-2xl overflow-hidden shadow-md"
          style={{ background: brand.photo ? 'linear-gradient(135deg, #f0f2f5, #e8eaed)' : brand.color, padding: brand.photo ? '8px 10px' : '0', width: '180px', aspectRatio: '16/10' }}>
          {brand.photo ? (
            <img src={brand.photo} alt={brand.name}
              className="w-full h-full object-contain rounded-lg"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.15))' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-extrabold text-xl">{brand.name}</span>
            </div>
          )}
        </div>

        {/* Sélecteur de parcours — boutons côte à côte */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">{t('personalize.parcours_label')}</p>
          <div className="flex gap-3">
            {[
              { key: 'pre', label: t('personalize.parcours_pre') },
              { key: 'post', label: t('personalize.parcours_post') },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setParcours(key)}
                className="py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap"
                style={
                  parcours === key
                    ? { background: brand.color, color: 'white', boxShadow: `0 6px 20px ${brand.color}40` }
                    : { background: 'white', color: '#64748b', border: '1px solid #e2e8f0' }
                }>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className={`grid grid-cols-1 gap-6 items-stretch mx-auto w-full ${parcours === 'post' ? 'md:grid-cols-2 max-w-3xl' : 'md:grid-cols-3 max-w-7xl'}`}>

        {/* ── Étape 1 : Votre commande ── */}
        <StepCard index={0} title={t('personalize.step0.title')} enabled={activeStep >= 0}
          completed={step0Done !== null && activeStep > 0} summary={step0Summary}
          onEdit={() => { setStep0Done(null); setActiveStep(0); }} brand={brand}>

          {/* Montant */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESETS.map((v) => {
              const sel = selectedPreset === v && !customAmount;
              return (
                <button key={v}
                  onClick={() => { setSelectedPreset(v); setCustomAmount(''); setStep0Errors((p) => ({ ...p, amount: '' })); }}
                  className="px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all"
                  style={sel
                    ? { background: brand.color, color: 'white', boxShadow: `0 4px 14px ${brand.color}55`, border: `1px solid ${brand.color}` }
                    : { background: 'white', color: '#475569', border: '1px solid #e2e8f0' }
                  }>
                  {formatAmount(v)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5 mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t('personalize.step0.amount_custom_label')}</label>
            <div className="relative">
              <input type="number" min={5} max={500} step={1} value={customAmount} placeholder="35"
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(null); setStep0Errors((p) => ({ ...p, amount: '' })); }}
                className={darkFieldClass(false)}
                style={customAmount ? { background: `${brand.color}08`, border: `1px solid ${brand.color}50`, color: '#1e293b' } : {}} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">€</span>
            </div>
            <p className="text-xs text-slate-400">{t('personalize.step0.amount_hint')}</p>
          </div>
          {step0Errors.amount && <p className="text-xs mb-4 text-red-500 font-medium">{step0Errors.amount}</p>}

          <div className="w-full h-px bg-slate-100 my-3" />

          {/* Vous */}
          <p className="text-xs font-bold uppercase tracking-widest mb-1.5 text-slate-400">{t('personalize.step0.section_you')}</p>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <DarkField label={t('personalize.step0.firstname')} error={step0Errors.senderName}>
              <input type="text" placeholder="Jean" value={senderName}
                onChange={(e) => { setSenderName(e.target.value); setStep0Errors((p) => ({ ...p, senderName: '' })); }}
                className={darkFieldClass(step0Errors.senderName)} />
            </DarkField>
            <DarkField label={t('personalize.step0.lastname')} error={step0Errors.senderLastName}>
              <input type="text" placeholder="Dupont" value={senderLastName}
                onChange={(e) => { setSenderLastName(e.target.value); setStep0Errors((p) => ({ ...p, senderLastName: '' })); }}
                className={darkFieldClass(step0Errors.senderLastName)} />
            </DarkField>
          </div>
          <div className="mb-3">
            <DarkField label={t('personalize.step0.email')} error={step0Errors.senderEmail}>
              <input type="email" placeholder="vous@exemple.fr" value={senderEmail}
                onChange={(e) => { setSenderEmail(e.target.value); setStep0Errors((p) => ({ ...p, senderEmail: '' })); }}
                className={darkFieldClass(step0Errors.senderEmail)} />
            </DarkField>
          </div>

          {/* Destinataire */}
          <p className="text-xs font-bold uppercase tracking-widest mb-1.5 text-slate-400">{t('personalize.step0.section_recipient')}</p>
          <div className="flex flex-col gap-2.5 mb-3">
            <div className="grid grid-cols-2 gap-3">
              <DarkField label={t('personalize.step0.recipient_firstname')} error={step0Errors.name}>
                <input type="text" placeholder="Marie" value={recipientName}
                  onChange={(e) => { setRecipientName(e.target.value); setStep0Errors((p) => ({ ...p, name: '' })); }}
                  className={darkFieldClass(step0Errors.name)} />
              </DarkField>
              <DarkField label={t('personalize.step0.recipient_lastname')} error={step0Errors.recipientLastName}>
                <input type="text" placeholder="Martin" value={recipientLastName}
                  onChange={(e) => { setRecipientLastName(e.target.value); setStep0Errors((p) => ({ ...p, recipientLastName: '' })); }}
                  className={darkFieldClass(step0Errors.recipientLastName)} />
              </DarkField>
            </div>
            <DarkField label={t('personalize.step0.recipient_email')} error={step0Errors.email}>
              <input type="email" placeholder="marie@exemple.fr" value={recipientEmail}
                onChange={(e) => { setRecipientEmail(e.target.value); setStep0Errors((p) => ({ ...p, email: '' })); }}
                className={darkFieldClass(step0Errors.email)} />
            </DarkField>

            <DarkField
              label={<>{t('personalize.step0.recipient_message')} <span className="text-slate-400 font-normal">{t('personalize.step0.recipient_message_optional')}</span></>}
              error={step0Errors.message}>
              <textarea rows={2} placeholder="Joyeux anniversaire !" value={personalMessage}
                onChange={(e) => { setPersonalMessage(e.target.value); setStep0Errors((p) => ({ ...p, message: '' })); }}
                maxLength={MAX_MSG + 10}
                className={`${darkFieldClass(step0Errors.message)} resize-none`} />
              <span className="text-xs text-right mt-1 font-medium"
                style={{ color: personalMessage.length > MAX_MSG ? '#ef4444' : '#94a3b8' }}>
                {personalMessage.length}/{MAX_MSG}
              </span>
            </DarkField>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex justify-end">
            <NextButton onClick={handleStep0Next} brand={brand}>{t('personalize.step0.next')}</NextButton>
          </div>
        </StepCard>

        {/* ── Étape 2 : Message (pré-paiement uniquement) ── */}
        {parcours === 'pre' && (
        <div ref={step1Ref} className="h-full">
          <StepCard index={1} title={t('personalize.step1.title')} enabled={activeStep >= 1}
            completed={step1Done !== null && activeStep > 1} summary={step1Summary}
            onEdit={() => { setStep1Done(null); setActiveStep(1); }} brand={brand}>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl transition-all mb-6 group"
              style={{
                background: hasVideo ? `${brand.color}10` : '#f8fafc',
                border: hasVideo ? `1px solid ${brand.color}40` : '1px solid #e2e8f0',
              }}>
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" className="sr-only" checked={hasVideo}
                  onChange={(e) => { setHasVideo(e.target.checked); if (!e.target.checked) setVideoRecorded(false); }} />
                <div className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all group-hover:border-slate-400"
                  style={hasVideo ? { backgroundColor: brand.color, borderColor: brand.color } : { borderColor: '#cbd5e1', backgroundColor: 'white' }}>
                  {hasVideo && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">{t('personalize.step1.add_video')}</p>
                <p className="text-xs mt-1 text-slate-500 leading-relaxed">{t('personalize.step1.add_video_desc')}</p>
              </div>
            </label>

            <div className="rounded-2xl overflow-hidden mb-6 transition-all duration-300 shadow-sm"
              style={{ opacity: hasVideo ? 1 : 0.4, border: '1px solid #e2e8f0' }}>
              <div className="aspect-video relative flex items-center justify-center bg-slate-50">
                <div className="absolute inset-0 pointer-events-none opacity-5"
                  style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }} />

                {!hasVideo && (
                  <div className="flex flex-col items-center gap-3 relative z-10 text-slate-400 group-hover:text-primary-500 transition-colors">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-primary-100 group-hover:shadow-lg transition-all rotate-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-300 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-100/50">L'Effet Waouh</span>
                  </div>
                )}

                {hasVideo && !recording && !videoRecorded && (
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <div className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center bg-white shadow-xl shadow-primary-500/10 border border-primary-100 rotate-0 hover:rotate-3 transition-transform cursor-pointer group" onClick={handleRecord}>
                      <div className="absolute inset-0 bg-primary-50 rounded-[1.75rem] scale-0 group-hover:scale-100 transition-transform origin-center" />
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary-500 relative z-10 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-slate-100/50">{t('personalize.step1.ready_to_film')}</span>
                  </div>
                )}

                {hasVideo && recording && (
                  <>
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md px-2 py-1 z-10 bg-red-500 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-[10px] font-bold tracking-wider">REC</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <span className="w-6 h-6 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/40" />
                      <span className="text-sm font-medium text-slate-600">{t('personalize.step1.recording')}</span>
                    </div>
                  </>
                )}

                {hasVideo && videoRecorded && !recording && (
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <div className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center bg-green-50 shadow-xl shadow-green-500/10 border-2 border-green-200 hover:-rotate-3 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-green-600 tracking-wide uppercase bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-green-100">{t('personalize.step1.done')}</span>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 flex items-center justify-between bg-white border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  {videoRecorded ? t('personalize.step1.duration_done') : t('personalize.step1.duration_max')}
                </span>
                <button
                  onClick={videoRecorded ? () => setVideoRecorded(false) : handleRecord}
                  disabled={recording || !hasVideo}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm disabled:opacity-30 disabled:shadow-none hover:-translate-y-0.5"
                  style={{ backgroundColor: videoRecorded ? '#475569' : brand.color }}>
                  {recording ? t('personalize.step1.in_progress') : videoRecorded ? t('personalize.step1.redo') : t('personalize.step1.record')}
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {t('personalize.step1.tip')}
            </p>

            <div className="mt-auto pt-6 border-t border-slate-100 flex justify-end">
              <NextButton onClick={handleStep1Next} brand={brand}>{t('personalize.step1.next')}</NextButton>
            </div>
          </StepCard>
        </div>
        )}

        {/* ── Étape 3 : Paiement ── */}
        <div ref={step2Ref} className="h-full">
          <StepCard index={parcours === 'post' ? 1 : 2} title={t('personalize.step2.title')} enabled={activeStep >= 2} brand={brand}>

            {/* Mini récap */}
            {step0Done && (
              <div className="rounded-2xl px-5 py-4 mb-6 bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('personalize.step2.total')}</span>
                  <span className="text-2xl font-black" style={{ color: brand.color }}>{formatAmount(step0Done.amount)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold text-slate-500">{t('personalize.step2.recipient_label')}</span>
                  <span className="text-sm font-bold text-slate-700">{step0Done.name}</span>
                </div>
                {step1Done?.hasVideoMessage && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-slate-500">{t('personalize.step2.bonus')}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: brand.color }}>{t('personalize.step2.video_included')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Formulaire carte */}
            <div className="flex flex-col gap-4 mb-6">
              <DarkField label={t('personalize.step2.card_name')} error={cardErrors.cardName}>
                <input type="text" placeholder={t('personalize.step2.card_name_placeholder')} value={cardName}
                  onChange={(e) => { setCardName(e.target.value); setCardErrors((p) => ({ ...p, cardName: '' })); }}
                  className={darkFieldClass(cardErrors.cardName)} />
              </DarkField>

              <DarkField label={t('personalize.step2.card_number')} error={cardErrors.cardNumber}>
                <div className="relative">
                  <input type="text" placeholder={t('personalize.step2.card_number_placeholder')} value={cardNumber}
                    onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setCardErrors((p) => ({ ...p, cardNumber: '' })); }}
                    className={darkFieldClass(cardErrors.cardNumber)}
                    inputMode="numeric" maxLength={19} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-70">
                    <div className="w-7 h-5 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }} />
                    <div className="w-7 h-5 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }} />
                  </div>
                </div>
              </DarkField>

              <div className="grid grid-cols-2 gap-3">
                <DarkField label={t('personalize.step2.card_expiry')} error={cardErrors.cardExpiry}>
                  <input type="text" placeholder={t('personalize.step2.expiry_placeholder')} value={cardExpiry}
                    onChange={(e) => { setCardExpiry(formatExpiry(e.target.value)); setCardErrors((p) => ({ ...p, cardExpiry: '' })); }}
                    className={darkFieldClass(cardErrors.cardExpiry)}
                    inputMode="numeric" maxLength={5} />
                </DarkField>
                <DarkField label={t('personalize.step2.card_cvv')} error={cardErrors.cardCvv}>
                  <div className="relative">
                    <input type="text" placeholder="123" value={cardCvv}
                      onChange={(e) => { setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setCardErrors((p) => ({ ...p, cardCvv: '' })); }}
                      className={darkFieldClass(cardErrors.cardCvv)}
                      inputMode="numeric" maxLength={4} />
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </DarkField>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100">
              {payError && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-200 shadow-sm">
                  {payError}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={paying || !step0Done || (parcours === 'pre' && !step1Done)}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-base text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                style={{
                  background: paying ? brand.color : `linear-gradient(135deg, ${brand.color} 0%, #EC4899 100%)`,
                  boxShadow: paying ? 'none' : `0 10px 30px -5px ${brand.color}60`,
                }}>
                {paying ? (
                  <><span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />{t('personalize.step2.validating')}</>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {t('personalize.step2.pay')} {step0Done ? formatAmount(step0Done.amount) : ''}
                  </>
                )}
              </button>
              <p className="text-center text-xs mt-4 text-slate-400 font-medium">
                {t('personalize.step2.demo_notice')}
              </p>
            </div>
          </StepCard>
        </div>

      </div>
    </div>
  );
}

function NextButton({ children, onClick, brand }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
      style={{ backgroundColor: brand.color, boxShadow: `0 4px 14px ${brand.color}45` }}>
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
      <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function VideoRecordingModal({ data, onVideoRecorded }) {
  const { t } = useTranslation();
  const { brand } = data;
  const [recordState, setRecordState] = useState('idle'); // 'idle' | 'recording' | 'done'

  function handleStart() {
    setRecordState('recording');
    setTimeout(() => setRecordState('done'), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-white shadow-2xl">

        {/* Header */}
        <div className="px-8 pt-7 pb-5 text-center"
          style={{ background: `linear-gradient(135deg, ${brand.color} 0%, ${brand.color}cc 100%)` }}>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 overflow-hidden">
            {brand.photo
              ? <img src={brand.photo} alt={brand.name} className="w-full h-full object-contain p-1" />
              : <span className="text-white font-black text-2xl">{brand.name[0]}</span>
            }
          </div>
          <h2 className="text-white font-black text-xl">{t('personalize.video_modal.title')}</h2>
          <p className="text-white/70 text-xs mt-1">{brand.name} · {t('personalize.video_modal.subtitle')}</p>
        </div>

        {/* Corps */}
        <div className="px-8 py-7">
          {recordState !== 'done' ? (
            <>
              <p className="text-slate-700 text-sm text-center leading-relaxed mb-6">
                {t('personalize.video_modal.instruction')}
              </p>

              <div className="flex gap-5 mb-2">
                {/* QR Code */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('personalize.video_modal.scan_label')}</p>
                  <img src="/api/qr?url=https://www.livstick.com" alt="QR Code"
                    className="w-28 h-28 rounded-xl border border-slate-200" />
                </div>

                {/* Player */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('personalize.video_modal.record_label')}</p>
                  <div className="w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center relative overflow-hidden"
                    style={{ aspectRatio: '4/3' }}>
                    {recordState === 'idle' && (
                      <div className="flex flex-col items-center gap-2 text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-slate-400">{t('personalize.video_modal.camera_label')}</span>
                      </div>
                    )}
                    {recordState === 'recording' && (
                      <>
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-500 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="text-white text-[10px] font-bold">REC</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/40" />
                          <span className="text-xs text-slate-500">{t('personalize.video_modal.in_progress')}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <button onClick={handleStart} disabled={recordState === 'recording'}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: brand.color }}>
                    {recordState === 'recording' ? t('personalize.video_modal.in_progress') : t('personalize.video_modal.start')}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* État: enregistrement terminé */
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-2">{t('personalize.video_modal.done_title')}</h3>
              <p className="text-slate-500 text-sm mb-6">{t('personalize.video_modal.done_desc')}</p>
              <button onClick={onVideoRecorded}
                className="w-full py-4 rounded-2xl font-extrabold text-base text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${brand.color}, #EC4899)`, boxShadow: `0 10px 30px -5px ${brand.color}60` }}>
                {t('personalize.video_modal.see_voucher')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VoucherModal({ data, onClose }) {
  const { brand, step0, step1 } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      {/* Voucher card */}
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'white', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

        {/* Header coloré */}
        <div className="relative px-8 pt-8 pb-6 flex flex-col items-center"
          style={{ background: `linear-gradient(135deg, ${brand.color} 0%, ${brand.color}cc 100%)` }}>
          {/* Logo / nom enseigne */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 overflow-hidden bg-white/20">
            {brand.photo
              ? <img src={brand.photo} alt={brand.name} className="w-full h-full object-contain p-1" />
              : <span className="text-white font-black text-2xl">{brand.name[0]}</span>
            }
          </div>
          <h2 className="text-white font-black text-2xl tracking-tight">{brand.name}</h2>
          <p className="text-white/70 text-xs mt-1 uppercase tracking-widest font-medium">Carte Cadeau</p>

          {/* Montant */}
          <div className="mt-4 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-white font-black text-3xl">{formatAmount(step0.amount)}</span>
          </div>

          {/* Motif décoratif */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-white" />
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-10 bg-white" />
        </div>

        {/* Corps */}
        <div className="px-8 py-6">
          {/* Phrase principale */}
          <p className="text-center text-slate-700 text-sm leading-relaxed mb-6">
            <span className="font-bold text-slate-900">{step0.name}</span>,{' '}
            <span className="font-semibold" style={{ color: brand.color }}>{step0.senderName}</span>{' '}
            vous a offert{' '}
            <span className="font-bold text-slate-900">{formatAmount(step0.amount)}</span>
          </p>

          {/* Section message vidéo */}
          {step1?.hasVideoMessage && (
            <div className="rounded-2xl p-5 text-center"
              style={{ background: `${brand.color}0d`, border: `1px solid ${brand.color}30` }}>
              <p className="text-sm font-medium text-slate-700 mb-4 leading-relaxed">
                Vous avez un message avec cette carte, pour le regarder{' '}
                <a
                  href="https://www.livstick.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline underline-offset-2"
                  style={{ color: brand.color }}
                >
                  CLIQUER ICI
                </a>
                {' '}ou scannez ce QR Code
              </p>
              <img
                src="/api/qr?url=https://www.livstick.com"
                alt="QR Code"
                className="w-28 h-28 mx-auto rounded-xl"
                style={{ border: `2px solid ${brand.color}30` }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <a
              href={`/api/orders/${data.order.id}/voucher-pdf`}
              download
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${brand.color}, #EC4899)` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger le PDF
            </a>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#64748b' }}
            >
              Voir ma confirmation
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            Site de démonstration — aucun paiement réel
          </p>
        </div>
      </div>
    </div>
  );
}
