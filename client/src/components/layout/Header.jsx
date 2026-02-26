import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'de', label: 'DE' },
  { code: 'pl', label: 'PL' },
];

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 border border-slate-200"
      >
        {current.label}
        <svg className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-20 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm font-medium transition-colors ${lang.code === i18n.language ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation();

  const NAV = [
    { to: '/', label: t('nav.demo'), exact: true },
    { to: '/about', label: t('nav.about') },
    { to: '/tech', label: t('nav.tech') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="no-underline transition-transform hover:scale-105 active:scale-95">
          <Logo />
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="w-px h-5 mx-2 bg-slate-200" />

          <NavLink
            to="/backoffice"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                ? 'bg-secondary-50 text-secondary-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            {t('nav.admin')}
          </NavLink>

          <div className="w-px h-5 mx-2 bg-slate-200" />

          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
}
