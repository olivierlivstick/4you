export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-3">
          <img
            src="/4you-logo.svg"
            alt="4you"
            className="h-7 w-auto opacity-80"
          />
          <span>Site de démonstration</span>
        </div>
        <span>© 2026 — Aucun paiement réel n'est traité</span>
      </div>
    </footer>
  );
}
