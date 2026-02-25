import { useEffect, useState } from 'react';
import { getBrands } from '../api/client';
import BrandCard from '../components/home/BrandCard';
import { Zap, Video, FileText, Heart, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Decorative Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-200/40 blur-3xl mix-blend-multiply"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-secondary-200/40 blur-3xl mix-blend-multiply"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
            className="absolute -bottom-20 left-1/2 w-80 h-80 rounded-full bg-accent-200/30 blur-3xl mix-blend-multiply"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-primary-200 shadow-sm mb-8 text-primary-700 font-medium text-sm"
          >
            <Heart size={16} className="text-primary-500" fill="currentColor" />
            <span>La nouvelle façon d'offrir</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 tracking-tight leading-tight max-w-4xl"
          >
            Offrez bien plus qu'une carte,{' '}
            <span className="block mt-2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent pb-2">
              offrez une émotion.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed"
          >
            Des cartes cadeaux digitales pour vos enseignes préférées — enrichies par un message vidéo personnel pour un effet surprise garanti.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#brands" className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
              <Gift size={20} className="group-hover:rotate-12 transition-transform" />
              Choisir une enseigne
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Feature strip ──────────────────────────────────── */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Immédiat & Facile',
              desc: 'Livraison instantanée par email. Prêt à être offert en quelques clics.',
              color: 'text-accent-500',
              bg: 'bg-accent-50',
              border: 'border-accent-100'
            },
            {
              icon: Video,
              title: 'L\'Effet Waouh',
              desc: 'Enregistrez une vidéo personnelle qui s\'animera lors de l\'ouverture de la carte.',
              color: 'text-primary-500',
              bg: 'bg-primary-50',
              border: 'border-primary-100'
            },
            {
              icon: FileText,
              title: 'Expérience Premium',
              desc: 'Un design élégant, un QR code discret, et une attention inoubliable.',
              color: 'text-secondary-500',
              bg: 'bg-secondary-50',
              border: 'border-secondary-100'
            },
          ].map((f, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
              key={f.title}
              className={`glass rounded-3xl p-8 transition-transform hover:-translate-y-1 duration-300`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${f.bg} ${f.color} border ${f.border} shadow-sm`}>
                <f.icon size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Brand grid ─────────────────────────────────────── */}
      <section id="brands" className="w-full px-4 sm:px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            Trouvez le cadeau parfait
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Une sélection des meilleures enseignes pour combler toutes les envies.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse shadow-sm border border-slate-100">
                <div className="h-44 bg-slate-100" />
                <div className="p-6">
                  <div className="h-5 bg-slate-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {brands.map((brand, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                key={brand.id}
                className="h-full flex"
              >
                <div className="w-full flex">
                  <BrandCard brand={brand} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
