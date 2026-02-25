import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function VideoPage() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/voucher/${orderId}/video`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-medium bg-red-50 p-4 rounded-2xl">{error || 'Commande introuvable'}</p>
        <Link to="/" className="mt-6 inline-block text-primary-600 font-bold hover:underline transition-all">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-3xl mix-blend-multiply opacity-30"
          style={{ backgroundColor: data.brandColor }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-secondary-300 rounded-full blur-3xl mix-blend-multiply opacity-20" />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto px-4 w-full relative z-10"
      >
        {/* Brand header */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring' }}
            className="h-16 rounded-3xl flex items-center px-8 shadow-xl"
            style={{ background: `linear-gradient(135deg, ${data.brandColor}, ${data.brandColor}dd)`, boxShadow: `0 10px 30px -10px ${data.brandColor}80` }}
          >
            <span className="text-white font-black tracking-tight text-xl drop-shadow-sm">{data.brandName}</span>
          </motion.div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
            Surprise pour <span style={{ color: data.brandColor }}>{data.recipientName}</span> !
          </h1>
          <p className="text-slate-500 font-medium text-lg">Carte cadeau exclusive · <span className="text-slate-700 font-bold px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-sm ml-1">{data.giftCode}</span></p>
        </div>

        {data.hasVideoMessage ? (
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            className="bg-white rounded-[2rem] shadow-2xl overflow-hidden glass border border-white/50 relative mx-auto"
            style={{ boxShadow: `0 25px 50px -12px ${data.brandColor}25` }}
          >
            {/* Fake video player setup */}
            <div className="relative aspect-video flex items-center justify-center bg-slate-900 group cursor-pointer overflow-hidden">
              {/* Poster Base */}
              <div className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60"
                style={{
                  background: `radial-gradient(circle at center, ${data.brandColor}90 0%, #0f172a 120%)`
                }}
              />

              {/* Pattern overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Play Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all"
                style={{ background: `linear-gradient(135deg, ${data.brandColor}, ${data.brandColor}ee)` }}
              >
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: data.brandColor }} />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>

              {/* Video Label */}
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-black/50 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2.5 border border-white/10 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                  <span className="text-white text-xs md:text-sm font-semibold tracking-wide">Message exclusif</span>
                </div>
              </div>

              {/* Progress bar (decorative) */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
                <div className="h-full w-[15%] rounded-r-full relative" style={{ backgroundColor: data.brandColor }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
                </div>
              </div>
            </div>

            {/* Player controls */}
            <div className="bg-white/90 backdrop-blur-xl p-5 md:p-6 flex items-center justify-between gap-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-800">Un mot spécial vous attend</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Appuyez sur play pour découvrir</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <span className="text-xs md:text-sm font-bold text-slate-500 tabular-nums px-3 py-1.5 rounded-xl bg-slate-100/80">0:00 / 0:34</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-[2rem] border border-slate-100/60 shadow-xl shadow-slate-200/40 p-12 text-center relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: data.brandColor }} />

            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center mx-auto mb-6 shadow-sm rotate-3">
              <span className="text-5xl drop-shadow-md">🎁</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Un cadeau pour vous !</h3>
            <p className="text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
              L'expéditeur n'a pas ajouté de message vidéo, mais la surprise reste entière. Profitez bien de votre carte cadeau de {data.brandName}.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-14 flex flex-col items-center gap-6"
        >
          <div
            className="flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm border border-black/5"
            style={{ backgroundColor: `${data.brandColor}15`, color: data.brandColor }}
          >
            <span className="text-lg">🛍️</span>
            <span>Prête à être utilisée lors de votre prochain achat</span>
          </div>

          <div className="w-12 h-px bg-slate-200" />

          <div className="text-center">
            <p className="text-xs text-slate-400 font-medium mb-3">
              Fonctionnalité vidéo en démonstration technique.<br />
            </p>
            <Link to="/" className="inline-block text-sm font-bold tracking-wide text-primary-500 hover:text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-2xl transition-all">
              Offrir une carte cadeau à mon tour
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
