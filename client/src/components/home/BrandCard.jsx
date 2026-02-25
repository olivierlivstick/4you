import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';

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
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left w-full cursor-pointer"
    >
      {/* Color band */}
      <div
        className="h-28 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: brand.color }}
      >
        {brand.photo ? (
          <img
            src={brand.photo}
            alt={brand.name}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <>
            <span
              className="text-white font-bold text-3xl tracking-tight drop-shadow-sm"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
            >
              {brand.name}
            </span>
            {/* Decorative circles */}
            <div
              className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-20"
              style={{ backgroundColor: 'white' }}
            />
            <div
              className="absolute -top-4 -left-4 w-12 h-12 rounded-full opacity-10"
              style={{ backgroundColor: 'white' }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-800 text-base">{brand.name}</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: brand.color + '18',
              color: brand.color,
            }}
          >
            {brand.category}
          </span>
        </div>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{brand.description}</p>
        <div className="mt-3 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
          style={{ color: brand.color }}
        >
          <span>Offrir</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
