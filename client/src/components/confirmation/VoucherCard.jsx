import { useTranslation } from 'react-i18next';
import { formatAmount, formatDate } from '../../utils/formatters';

export default function VoucherCard({ order }) {
  const { t } = useTranslation();
  const brandColor = order.brand_color;
  const videoUrl = `/voucher/${order.id}/video`;

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 max-w-md mx-auto relative glass"
      style={{ boxShadow: `0 25px 50px -12px ${brandColor}25` }}>
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-40 blur-3xl pointer-events-none" />

      {/* Header */}
      <div
        className="px-8 pt-10 pb-8 relative overflow-hidden flex flex-col items-center text-center"
        style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}e6)` }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 bg-white blur-md" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10 bg-white blur-md" />

        <div className="relative z-10">
          <span className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase drop-shadow-sm">{t('voucher.card_label')}</span>
          <h2 className="text-white font-black text-4xl mt-2 tracking-tight drop-shadow-md">{order.brand_name}</h2>
          <span
            className="inline-block mt-4 text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
          >
            {order.brand_category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-8 relative">
        {/* Amount */}
        <div className="mb-8 text-center bg-slate-50 py-4 rounded-2xl border border-slate-100/50 shadow-sm relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: brandColor }} />
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">{t('voucher.amount_label')}</p>
          <p className="text-5xl font-black tracking-tight" style={{ color: brandColor }}>
            {formatAmount(order.amount)}
          </p>
        </div>

        {/* Recipient */}
        <div className="mb-6 flex flex-col items-center text-center">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">{t('voucher.offered_to')}</p>
          <p className="text-xl font-extrabold text-slate-800">{order.recipient_name}</p>
        </div>

        {/* Personal message */}
        {order.personal_message && (
          <div className="mb-6 px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 text-center relative">
            <span className="text-4xl absolute -top-4 left-4 text-slate-200 font-serif">"</span>
            <p className="text-sm text-slate-600 font-medium italic relative z-10 mt-2">{order.personal_message}</p>
            <span className="text-4xl absolute -bottom-6 right-4 text-slate-200 font-serif">"</span>
          </div>
        )}

        {/* Gift code */}
        <div className="mb-8">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2 text-center">{t('voucher.code_label')}</p>
          <div
            className="px-4 py-3.5 rounded-2xl text-center shadow-sm"
            style={{ backgroundColor: brandColor + '0d', border: `1px solid ${brandColor}30` }}
          >
            <span className="font-mono font-black text-2xl tracking-[0.15em]" style={{ color: brandColor }}>
              {order.gift_code}
            </span>
          </div>
        </div>

        {/* Action / Video or Instructions */}
        {order.has_video_message === 1 ? (
          <div className="mb-2 bg-gradient-to-b from-slate-50 to-white p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center shadow-sm">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-3">{t('voucher.video_section')}</p>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block relative group transition-transform hover:scale-105 mb-3">
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-bold text-sm bg-white/90 px-3 py-1.5 rounded-lg shadow-sm" style={{ color: brandColor }}>{t('voucher.video_cta')}</span>
              </div>
              <img
                src={`/api/qr?url=${encodeURIComponent(window.location.origin + videoUrl)}`}
                alt="QR code"
                className="w-28 h-28 rounded-2xl shadow-lg"
                style={{ border: `2px solid ${brandColor}40` }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="hidden w-28 h-28 rounded-2xl border border-slate-200 flex-col items-center justify-center gap-1 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={(e) => { e.preventDefault(); window.open(videoUrl, '_blank'); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span className="text-xs text-slate-400 text-center px-2 font-medium">{t('voucher.video_link')}</span>
              </div>
            </a>
            <p className="text-xs text-slate-500 font-medium max-w-[200px] leading-relaxed">
              {t('voucher.video_scan_hint')}
            </p>
          </div>
        ) : (
          <div className="mb-2 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300/50 flex items-center justify-center mb-3">
              <span className="text-2xl drop-shadow-sm">🛍️</span>
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-[220px] leading-relaxed">
              {t('voucher.no_video_hint')}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{formatDate(order.created_at)}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono tracking-[0.2em] opacity-60">4YOU</span>
      </div>
    </div>
  );
}
