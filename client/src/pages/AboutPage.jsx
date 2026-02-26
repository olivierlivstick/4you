import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-violet-500 uppercase mb-4">{t('about.tag')}</span>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-5">
          {t('about.title')}
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          {t('about.intro')}
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          { icon: '🎁', title: t('about.value1_title'), body: t('about.value1_body') },
          { icon: '🎥', title: t('about.value2_title'), body: t('about.value2_body') },
          { icon: '⚡', title: t('about.value3_title'), body: t('about.value3_body') },
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
        <h2 className="text-xl font-bold text-slate-800 mb-4">{t('about.story_title')}</h2>
        <p className="text-slate-500 leading-relaxed mb-3">
          {t('about.story_1')}
        </p>
        <p className="text-slate-500 leading-relaxed">
          {t('about.story_2')}
        </p>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('about.team_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { initials: 'OA', name: 'Olivier Adler', role: t('about.role_ceo'), color: '#7c3aed' },
            { initials: 'PD', name: 'Produit & Design', role: t('about.role_design'), color: '#0ea5e9' },
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
