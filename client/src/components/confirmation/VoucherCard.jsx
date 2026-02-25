import { formatAmount, formatDate } from '../../utils/formatters';

export default function VoucherCard({ order }) {
  const brandColor = order.brand_color;
  const videoUrl = `/voucher/${order.id}/video`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-w-md mx-auto">
      {/* Header */}
      <div
        className="px-8 pt-8 pb-6 relative overflow-hidden"
        style={{ backgroundColor: brandColor }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10 bg-white" />

        <div className="relative">
          <span className="text-white/70 text-xs font-medium tracking-widest uppercase">Carte Cadeau</span>
          <h2 className="text-white font-bold text-3xl mt-1">{order.brand_name}</h2>
          <span
            className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            {order.brand_category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        {/* Amount */}
        <div className="mb-5">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Montant</p>
          <p className="text-4xl font-bold" style={{ color: brandColor }}>
            {formatAmount(order.amount)}
          </p>
        </div>

        {/* Recipient */}
        <div className="mb-5">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Pour</p>
          <p className="text-lg font-semibold text-slate-800">{order.recipient_name}</p>
        </div>

        {/* Personal message */}
        {order.personal_message && (
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Message</p>
            <p className="text-sm text-slate-600 italic">{order.personal_message}</p>
          </div>
        )}

        {/* Gift code */}
        <div className="mb-5">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Code cadeau</p>
          <div
            className="px-4 py-3 rounded-xl text-center"
            style={{ backgroundColor: brandColor + '12', border: `1.5px solid ${brandColor}40` }}
          >
            <span className="font-mono font-bold text-lg tracking-wider" style={{ color: brandColor }}>
              {order.gift_code}
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-5 flex flex-col items-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Message vidéo</p>
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={`/api/qr?url=${encodeURIComponent(window.location.origin + videoUrl)}`}
              alt="QR code"
              className="w-28 h-28 rounded-xl border border-slate-100"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="hidden w-28 h-28 rounded-xl border border-slate-200 flex-col items-center justify-center gap-1 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => window.open(videoUrl, '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="text-xs text-slate-400 text-center px-2">Voir vidéo</span>
            </div>
          </a>
          <p className="text-xs text-slate-400 mt-2 text-center">Scannez pour accéder au message</p>
        </div>

        {/* Video badge */}
        {order.has_video_message === 1 && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-5"
            style={{ backgroundColor: brandColor + '15', color: brandColor }}
          >
            <span>🎥</span>
            <span>Message vidéo personnalisé inclus</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">{formatDate(order.created_at)}</span>
        <span className="text-xs text-slate-400">4you © 2026</span>
      </div>
    </div>
  );
}
