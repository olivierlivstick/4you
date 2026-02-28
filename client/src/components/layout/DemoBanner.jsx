import { useTranslation } from 'react-i18next';

export default function DemoBanner() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-start gap-3">
      <span className="text-amber-500 mt-0.5 flex-shrink-0" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
      <p className="text-base text-amber-800 font-medium leading-relaxed max-w-screen-2xl mx-auto">
        {t('demo_banner')}
      </p>
    </div>
  );
}
