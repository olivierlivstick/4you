import { useEffect, useState } from 'react';
import { getBrands } from '../api/client';
import BrandCard from '../components/home/BrandCard';

export default function HomePage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0F0C29 0%, #1E1B4B 40%, #2D1B69 70%, #6C3AED 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)' }}
          />
        </div>

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(168,85,247,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Content — horizontal layout */}
        <div className="relative z-10 w-full px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          {/* Logo */}
          <div className="flex-shrink-0" style={{ filter: 'drop-shadow(0 0 24px rgba(168,85,247,0.5))' }}>
            <img src="/4you-logo.svg" alt="4you" style={{ height: '88px', width: 'auto' }} />
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px self-stretch" style={{ background: 'rgba(168,85,247,0.3)' }} />

          {/* Text */}
          <div className="flex flex-col gap-1.5">
            <h1
              className="font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', textShadow: '0 2px 30px rgba(108,58,237,0.4)' }}
            >
              Offrez la liberté{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #C084FC 0%, #F472B6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                du choix
              </span>
            </h1>
            <p className="text-sm sm:text-base whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Des cartes cadeaux digitales pour vos enseignes préférées —{' '}
              <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                avec un message vidéo personnel en prime.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Brand grid ─────────────────────────────────────── */}
      <section className="w-full px-8 py-16" style={{ background: '#F5F3FF' }}>
        {/* Section heading */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#A855F7' }}>
            Enseignes disponibles
          </p>
          <h2 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>
            Choisissez votre enseigne
          </h2>
          <div
            className="mt-3 h-1 w-14 rounded-full"
            style={{ background: 'linear-gradient(90deg, #6C3AED, #EC4899)' }}
          />
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="h-28 bg-slate-100" />
                <div className="p-4">
                  <div className="h-4 bg-slate-100 rounded mb-2" />
                  <div className="h-3 bg-slate-50 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              className="mt-4 text-sm underline"
              style={{ color: '#6C3AED' }}
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </section>

      {/* ── Feature strip ──────────────────────────────────── */}
      {!loading && !error && (
        <section className="w-full px-8 pb-20" style={{ background: '#F5F3FF' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '⚡',
                title: 'Instantané',
                desc: 'Livraison immédiate par email. Le destinataire reçoit son voucher en quelques secondes.',
                accent: '#A855F7',
              },
              {
                icon: '🎥',
                title: 'Message vidéo',
                desc: 'Enregistrez un message vidéo personnel. Accessible via QR code sur le voucher.',
                accent: '#EC4899',
              },
              {
                icon: '📄',
                title: 'Voucher PDF',
                desc: 'Un document A4 élégant avec QR code intégré — imprimable ou partageable.',
                accent: '#6C3AED',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="relative overflow-hidden rounded-2xl p-7"
                style={{ background: 'linear-gradient(145deg, #1E1B4B 0%, #2D1B69 100%)' }}
              >
                {/* Orb accent */}
                <div
                  className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${f.accent}40 0%, transparent 70%)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5 relative z-10"
                  style={{ background: `${f.accent}22`, border: `1px solid ${f.accent}40` }}
                >
                  {f.icon}
                </div>
                <p className="font-bold text-white text-base mb-2 relative z-10">{f.title}</p>
                <p className="text-sm leading-relaxed relative z-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
