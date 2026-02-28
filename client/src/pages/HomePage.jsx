import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getBrands } from '../api/client';
import BrandCard from '../components/home/BrandCard';
import { Zap, Video, FileText, Heart, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const features = [
    {
      icon: Zap,
      title: t('home.features.ready_title'),
      desc: t('home.features.ready_desc'),
      color: 'text-accent-500',
      bg: 'bg-accent-50',
      border: 'border-accent-200',
      image: '/images/feature_instant.png'
    },
    {
      icon: Video,
      title: t('home.features.surprise_title'),
      desc: t('home.features.surprise_desc'),
      color: 'text-primary-500',
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      image: '/images/feature_emotion.png'
    },
    {
      icon: FileText,
      title: t('home.features.premium_title'),
      desc: t('home.features.premium_desc'),
      color: 'text-secondary-500',
      bg: 'bg-secondary-50',
      border: 'border-secondary-200',
      image: '/images/feature_premium.png'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-6 pb-24 sm:pt-10 sm:pb-32">
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

        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 lg:text-left text-center">
          <div className="flex-1 flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-primary-200 shadow-sm mb-8 text-primary-700 font-medium text-sm"
            >
              <Heart size={16} className="text-primary-500" fill="currentColor" />
              <span>{t('home.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 tracking-tight leading-tight max-w-2xl"
            >
              {t('home.title_1')}{' '}
              <span className="block mt-2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent pb-2 lg:pr-4">
                {t('home.title_2')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed"
            >
              {t('home.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a href="#brands" className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                <Gift size={20} className="group-hover:rotate-12 transition-transform" />
                {t('home.cta')}
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="flex-1 w-full max-w-md lg:max-w-none relative mt-8 lg:mt-0"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white/60 glass hover:rotate-2 transition-transform duration-500">
              <img src="/images/hero_lifestyle.png" alt={t('home.hero_alt')} className="w-full h-auto object-cover aspect-[4/3]" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl shadow-inner border border-green-200">🎉</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 leading-tight mb-0.5">{t('home.floating_badge')}</p>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">{t('home.floating_time')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature strip ──────────────────────────────────── */}
      <section className="relative z-20 max-w-screen-2xl mx-auto px-4 sm:px-6 w-full mt-10 md:-mt-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
              key={f.title}
              className={`glass rounded-[2rem] overflow-hidden border border-white/40 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl duration-500 group flex flex-col bg-white/80`}
            >
              <div className="w-full h-48 sm:h-56 relative overflow-hidden shrink-0">
                <img src={f.image} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center ${f.bg} ${f.color} border-2 border-white shadow-md z-10`}>
                  <f.icon size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-1 bg-white">
                <h3 className={`text-xl font-extrabold text-slate-800 mb-3 tracking-tight`}>{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm sm:text-base">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Brand grid ─────────────────────────────────────── */}
      <section id="brands" className="w-full px-4 sm:px-6 py-24 max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            {t('home.catalog_title')}
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            {t('home.catalog_subtitle')}
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
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
              {t('home.retry')}
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
            {brands.map((brand, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
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
