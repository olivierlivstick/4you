import { useTranslation } from 'react-i18next';

function CodeBlock({ children }) {
  return (
    <pre className="bg-slate-900 text-slate-100 rounded-xl p-5 text-xs leading-relaxed overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}

function Section({ tag, title, children }) {
  return (
    <section className="mb-14">
      {tag && <span className="inline-block text-xs font-semibold tracking-widest text-violet-500 uppercase mb-3">{tag}</span>}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Endpoint({ method, path, description }) {
  const colors = {
    GET: 'bg-emerald-100 text-emerald-700',
    POST: 'bg-blue-100 text-blue-700',
    PATCH: 'bg-amber-100 text-amber-700',
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono flex-shrink-0 mt-0.5 ${colors[method]}`}>{method}</span>
      <span className="font-mono text-sm text-slate-700 flex-shrink-0">{path}</span>
      <span className="text-sm text-slate-400">{description}</span>
    </div>
  );
}

export default function TechPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-violet-500 uppercase mb-4">{t('tech.tag')}</span>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-5">
          {t('tech.title')}
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          {t('tech.intro')}
        </p>
      </div>

      {/* Architecture */}
      <Section tag={t('tech.arch_tag')} title={t('tech.arch_title')}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: '⚛️', title: t('tech.frontend'), body: 'React 19 + Vite 7\nReact Router v7\nZustand\nTailwind CSS v4' },
            { icon: '🟢', title: t('tech.backend'), body: 'Node.js + Express ESM\nbetter-sqlite3 (sync)\npdf-lib + qrcode\nREST API JSON' },
            { icon: '🗃️', title: t('tech.storage'), body: 'SQLite (fichier local)\nVidéos : stockage objet\n(S3 / Cloudflare R2)\nPDF générés à la volée' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <span className="text-2xl mb-3 block">{icon}</span>
              <h3 className="font-semibold text-slate-800 text-sm mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>
        <CodeBlock>{`# Démarrage local
git clone https://github.com/your-org/4you && cd 4you
npm install           # installe client + server (workspaces)
cp server/.env.example server/.env
npm run dev           # client :5173  •  serveur :3001`}</CodeBlock>
      </Section>

      {/* API */}
      <Section tag={t('tech.api_tag')} title={t('tech.api_title')}>
        <div className="rounded-2xl border border-slate-100 overflow-hidden mb-6">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 font-mono">{t('tech.api_base')} http://localhost:3001</span>
          </div>
          <div className="px-5 divide-y divide-slate-50">
            <Endpoint method="GET"   path="/api/brands"               description="Liste toutes les enseignes disponibles" />
            <Endpoint method="GET"   path="/api/brands/:id"           description="Détail d'une enseigne" />
            <Endpoint method="POST"  path="/api/orders"               description="Crée une commande (status: pending)" />
            <Endpoint method="PATCH" path="/api/orders/:id/pay"       description="Simule le paiement (status: paid)" />
            <Endpoint method="GET"   path="/api/orders/:id"           description="Détail commande + brand (JOIN)" />
            <Endpoint method="GET"   path="/api/orders/:id/voucher-pdf" description="Génère et retourne le PDF A4" />
            <Endpoint method="GET"   path="/api/voucher/:id/video"    description="Page React du message vidéo (QR cible)" />
          </div>
        </div>

        <h3 className="font-semibold text-slate-700 mb-3">POST /api/orders — Corps de la requête</h3>
        <CodeBlock>{`{
  "brand_id":        1,                      // integer — requis
  "amount":          50,                     // float, 5–500 — requis
  "sender_email":    "alice@exemple.fr",     // email — requis
  "recipient_email": "bob@exemple.fr",       // email — requis
  "recipient_name":  "Bob",                  // string — requis
  "personal_message": "Joyeux anniversaire", // string 200 max — optionnel
  "has_video_message": true                  // boolean — optionnel
}`}</CodeBlock>
      </Section>

      {/* Video integration */}
      <Section tag={t('tech.video_tag')} title={t('tech.video_title')}>
        <p className="text-slate-500 leading-relaxed mb-6">
          {t('tech.video_intro')} l'API <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">MediaRecorder</code>,
          puis uploadé sur un stockage objet. L'URL est associée à la commande et encodée dans le QR code du voucher PDF.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {[
            { step: '1', title: t('tech.step_record'), desc: 'MediaRecorder capture le flux caméra/micro en WebM/H.264 directement dans le navigateur.' },
            { step: '2', title: t('tech.step_upload'), desc: 'Le blob vidéo est uploadé via une signed URL vers S3 ou Cloudflare R2. Aucune donnée ne transite par le serveur applicatif.' },
            { step: '3', title: t('tech.step_assoc'), desc: "L'identifiant vidéo (video_id) est stocké sur la commande via PATCH /api/orders/:id." },
            { step: '4', title: t('tech.step_qr'), desc: 'Le PDF embarque un QR code pointant vers /voucher/:orderId/video, qui streame la vidéo depuis le CDN.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 rounded-xl border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                {step}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm mb-0.5">{title}</p>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <CodeBlock>{`// Exemple — enregistrement côté client (extrait)
const stream   = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=h264' });
const chunks   = [];

recorder.ondataavailable = (e) => chunks.push(e.data);
recorder.onstop = async () => {
  const blob      = new Blob(chunks, { type: 'video/webm' });
  const { url }   = await fetch('/api/upload-url').then(r => r.json()); // signed URL
  await fetch(url, { method: 'PUT', body: blob });
  // → associer video_id à la commande
};

recorder.start();
setTimeout(() => recorder.stop(), 30_000); // max 30s`}</CodeBlock>
      </Section>

      {/* Schema */}
      <Section tag={t('tech.db_tag')} title={t('tech.db_title')}>
        <CodeBlock>{`CREATE TABLE brands (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  color       TEXT NOT NULL,     -- ex: '#7c3aed'
  category    TEXT NOT NULL
);

CREATE TABLE orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_id          INTEGER NOT NULL REFERENCES brands(id),
  amount            REAL NOT NULL,
  sender_email      TEXT NOT NULL DEFAULT '',
  recipient_email   TEXT NOT NULL,
  recipient_name    TEXT NOT NULL,
  personal_message  TEXT DEFAULT '',
  has_video_message INTEGER NOT NULL DEFAULT 0,
  video_id          TEXT,          -- identifiant stockage objet
  gift_code         TEXT NOT NULL UNIQUE, -- GC-XXXX-XXXX-XXXX
  status            TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid'
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);`}</CodeBlock>
      </Section>

      {/* Env */}
      <Section tag={t('tech.config_tag')} title={t('tech.config_title')}>
        <CodeBlock>{`# server/.env
PORT=3001
BASE_URL=http://localhost:3001   # URL publique pour les QR codes
NODE_ENV=development`}</CodeBlock>
      </Section>
    </div>
  );
}
