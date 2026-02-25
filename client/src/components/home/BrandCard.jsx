import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { ChevronRight } from 'lucide-react';

export default function BrandCard({ brand }) {
  const navigate = useNavigate();
  const setBrand = useOrderStore((s) => s.setBrand);

  function handleClick() {
    setBrand(brand);
    navigate(`/brand/${brand.id}`);
  }

  return (
    <button
      onClick={handleClick}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 text-left w-full cursor-pointer flex flex-col h-full"
    >
      {/* Visual Header */}
      <div
        className="h-44 flex items-center justify-center relative overflow-hidden shrink-0"
        style={{ backgroundColor: brand.color || '#f1f5f9' }}
      >
        {brand.photo ? (
          <img
            src={brand.photo}
            alt={brand.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply opacity-90"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-transparent duration-500" />
            <span
              className="text-white font-extrabold text-4xl tracking-tight relative z-10 transition-transform duration-500 group-hover:scale-110"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              {brand.name}
            </span>
            {/* Decorative circles */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/20 blur-xl" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 bg-white">
        <div className="flex items-start justify-between mb-3 gap-2">
          <span className="font-bold text-slate-800 text-lg leading-tight">{brand.name}</span>
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
            style={{
              backgroundColor: brand.color ? `${brand.color}15` : '#f1f5f9',
              color: brand.color || '#64748b',
            }}
          >
            {brand.category}
          </span>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-1 mb-6">
          {brand.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between transition-colors duration-300 group-hover:border-slate-200"
          style={{ color: brand.color || '#334155' }}
        >
          <span className="font-bold text-sm tracking-wide">Offrir cette carte</span>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
            style={{
              backgroundColor: brand.color ? `${brand.color}15` : '#f1f5f9',
              color: brand.color || '#475569'
            }}
          >
            <ChevronRight size={20} className="translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  );
}
