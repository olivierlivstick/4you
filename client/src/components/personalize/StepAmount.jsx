import { useState } from 'react';
import Button from '../ui/Button';
import { formatAmount } from '../../utils/formatters';

const PRESETS = [10, 25, 50, 75, 100];

export default function StepAmount({ brand, initialAmount, onNext }) {
  const [selected, setSelected] = useState(initialAmount || null);
  const [custom, setCustom] = useState(
    initialAmount && !PRESETS.includes(initialAmount) ? String(initialAmount) : ''
  );
  const [error, setError] = useState('');

  const effective = custom ? parseFloat(custom) : selected;

  function handleNext() {
    if (!effective || isNaN(effective)) {
      setError('Veuillez choisir ou saisir un montant');
      return;
    }
    if (effective < 5 || effective > 500) {
      setError('Le montant doit être entre 5€ et 500€');
      return;
    }
    onNext(effective);
  }

  function handlePreset(v) {
    setSelected(v);
    setCustom('');
    setError('');
  }

  function handleCustom(e) {
    setCustom(e.target.value);
    setSelected(null);
    setError('');
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Quel montant ?</h2>
      <p className="text-slate-500 mb-6">Choisissez un montant ou saisissez le vôtre</p>

      <div className="flex flex-wrap gap-3 mb-6">
        {PRESETS.map((v) => (
          <button
            key={v}
            onClick={() => handlePreset(v)}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
              selected === v && !custom
                ? 'border-transparent text-white shadow-md scale-105'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
            }`}
            style={selected === v && !custom ? { backgroundColor: brand.color, borderColor: brand.color } : {}}
          >
            {formatAmount(v)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 mb-2">
        <label className="text-sm font-medium text-slate-700">Ou un montant libre</label>
        <div className="relative">
          <input
            type="number"
            min={5}
            max={500}
            step={1}
            value={custom}
            onChange={handleCustom}
            placeholder="Ex: 35"
            className={`w-full px-4 py-3 pr-12 rounded-xl border text-slate-800 placeholder-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
              custom ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
        </div>
        <p className="text-xs text-slate-400">Entre 5€ et 500€</p>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {effective && !error && (
        <div
          className="flex items-center gap-2 text-sm font-medium mb-4 px-4 py-2 rounded-xl"
          style={{ backgroundColor: brand.color + '15', color: brand.color }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Montant sélectionné : {formatAmount(effective)}
        </div>
      )}

      <Button color={brand.color} onClick={handleNext} className="w-full sm:w-auto">
        Continuer
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
