export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-400'
            : 'border-slate-200 bg-white hover:border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
