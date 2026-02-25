export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-violet-500 uppercase mb-4">Qui sommes nous</span>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-5">
          La carte cadeau repensée pour l'ère&nbsp;vidéo
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          4you est une plateforme de cartes cadeaux digitales qui place l'émotion au cœur de l'expérience.
          Nous croyons qu'un cadeau ne se résume pas à un montant — c'est un message, une intention, un moment partagé.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          { icon: '🎁', title: 'Le cadeau réinventé', body: 'Des cartes cadeaux pour les enseignes que vous aimez, enrichies d\'un message vidéo personnel.' },
          { icon: '🎥', title: 'L\'émotion en plus', body: 'Un QR code unique sur chaque voucher donne accès au message vidéo enregistré par l\'offrant.' },
          { icon: '⚡', title: 'Simple & immédiat', body: 'Commande en moins de 3 minutes, voucher PDF généré instantanément, zéro friction.' },
        ].map(({ icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <span className="text-3xl mb-4 block">{icon}</span>
            <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="border-l-4 border-violet-200 pl-6 mb-16">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Notre histoire</h2>
        <p className="text-slate-500 leading-relaxed mb-3">
          Né d'un constat simple : les cartes cadeaux digitales existantes sont fonctionnelles, mais froides.
          Un code à 16 chiffres dans un email, c'est pratique — mais c'est loin d'un vrai cadeau.
        </p>
        <p className="text-slate-500 leading-relaxed">
          4you change ça en ajoutant une couche d'humanité : un message vidéo court, enregistré en quelques secondes,
          accessible via QR code au moment où le destinataire découvre son cadeau. Ce petit détail change tout.
        </p>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">L'équipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { initials: 'OA', name: 'Olivier Adler', role: 'Fondateur & CEO', color: '#7c3aed' },
            { initials: 'PD', name: 'Produit & Design', role: 'UX / Design système', color: '#0ea5e9' },
          ].map(({ initials, name, role, color }) => (
            <div key={name} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: color }}>
                {initials}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{name}</p>
                <p className="text-xs text-slate-400">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
