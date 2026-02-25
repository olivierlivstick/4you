const STEPS = ['Montant', 'Destinataire', 'Vidéo'];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  done
                    ? 'bg-violet-600 text-white'
                    : active
                    ? 'bg-violet-600 text-white ring-4 ring-violet-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-violet-600' : done ? 'text-slate-500' : 'text-slate-300'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 sm:mx-2 rounded mb-4 transition-all ${done ? 'bg-violet-600' : 'bg-slate-100'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
