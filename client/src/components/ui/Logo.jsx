import { Gift } from 'lucide-react';
import clsx from 'clsx';

export default function Logo({ className, iconSize = 28 }) {
  return (
    <div className={clsx("flex items-center gap-1.5 select-none", className)}>
      <div className="bg-gradient-to-tr from-primary-500 to-secondary-500 p-1.5 rounded-xl shadow-sm text-white flex items-center justify-center transform transition-transform hover:scale-105 hover:rotate-3">
        <Gift size={iconSize} strokeWidth={2.5} />
      </div>
      <div className="flex items-baseline tracking-tight">
        <span className="font-extrabold text-2xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          4
        </span>
        <span className="font-semibold text-2xl text-slate-700">
          you
        </span>
      </div>
    </div>
  );
}
