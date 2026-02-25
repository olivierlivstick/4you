export default function Button({ children, variant = 'primary', color, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  if (color) {
    return (
      <button
        className={`${base} text-white shadow-sm hover:opacity-90 active:scale-95 ${className}`}
        style={{ backgroundColor: color, '--tw-ring-color': color }}
        {...props}
      >
        {children}
      </button>
    );
  }

  const variants = {
    primary: 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm active:scale-95 focus:ring-violet-500',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 focus:ring-slate-400',
    outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 focus:ring-slate-400',
    ghost: 'text-slate-600 hover:bg-slate-100 active:scale-95 focus:ring-slate-400',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
