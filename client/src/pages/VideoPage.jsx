import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
        <div className="w-8 h-8 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-medium">{error || 'Commande introuvable'}</p>
        <Link to="/" className="mt-4 inline-block text-violet-600 underline text-sm">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Brand header */}
      <div
        className="h-14 rounded-2xl flex items-center px-6 mb-8"
        style={{ backgroundColor: data.brandColor }}
      >
        <span className="text-white font-bold text-lg">{data.brandName}</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Message vidéo pour {data.recipientName}
        </h1>
        <p className="text-slate-500">Carte cadeau · {data.giftCode}</p>
      </div>

      {data.hasVideoMessage ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Fake video player */}
          <div
            className="relative aspect-video flex items-center justify-center"
            style={{ backgroundColor: data.brandColor + '15' }}
          >
            {/* Play button */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg"
              style={{ backgroundColor: data.brandColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Video label */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-medium">Message vidéo personnalisé</span>
              </div>
            </div>

            {/* Progress bar (decorative) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
              <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: data.brandColor }} />
            </div>
          </div>

          {/* Player controls (decorative) */}
          <div className="p-4 flex items-center gap-3 border-t border-slate-50">
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: data.brandColor }} />
            </div>
            <span className="text-xs text-slate-400 tabular-nums">0:12 / 0:34</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-700 font-semibold mb-1">Aucun message vidéo</p>
          <p className="text-slate-400 text-sm">L'expéditeur n'a pas ajouté de message vidéo à ce cadeau.</p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: data.brandColor + '15', color: data.brandColor }}
        >
          <span>🎁</span>
          <span>Carte cadeau {data.brandName} · {data.giftCode}</span>
        </div>
        <p className="text-xs text-slate-400 text-center">
          Fonctionnalité vidéo disponible prochainement.<br />
          Ce message est un aperçu de la future expérience.
        </p>
        <Link to="/" className="text-sm text-violet-600 hover:underline">
          Offrir une carte cadeau
        </Link>
      </div>
    </div>
  );
}
