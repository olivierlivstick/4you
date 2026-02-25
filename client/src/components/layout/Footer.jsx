import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-4">
          <Logo iconSize={20} className="opacity-80 grayscale hover:grayscale-0 transition-all duration-500" />
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300"></span>
          <span>Site de démonstration</span>
        </div>
        <span>© 2026 — Aucun paiement réel n'est traité</span>
      </div>
    </footer>
  );
}
