import { useState } from 'react';
import Button from '../ui/Button';

export default function StepVideo({ brand, initialData, onNext, onBack }) {
  const [checked, setChecked] = useState(initialData?.hasVideoMessage || false);
  const [recorded, setRecorded] = useState(initialData?.videoRecorded || false);
  const [recording, setRecording] = useState(false);

  function handleRecord() {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setRecorded(true);
    }, 1800);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Message vidéo</h2>
      <p className="text-slate-500 mb-6">Rendez votre cadeau encore plus spécial</p>

      {/* Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all mb-6">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              if (!e.target.checked) setRecorded(false);
            }}
          />
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
              checked ? 'border-transparent' : 'border-slate-300 bg-white'
            }`}
            style={checked ? { backgroundColor: brand.color, borderColor: brand.color } : {}}
          >
            {checked && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Ajouter un message vidéo personnalisé 🎥</p>
          <p className="text-sm text-slate-500 mt-0.5">Enregistrez un message vidéo accessible via QR code sur le voucher</p>
        </div>
      </label>

      {/* Video recorder placeholder */}
      {checked && (
        <div className="mb-6 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden">
          {!recorded ? (
            <div className="p-8 flex flex-col items-center gap-4 bg-slate-50">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: brand.color + '20' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: brand.color }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-700">Prêt à enregistrer</p>
                <p className="text-sm text-slate-400 mt-1">Votre caméra sera activée pour l'enregistrement</p>
              </div>
              <Button
                color={brand.color}
                onClick={handleRecord}
                disabled={recording}
              >
                {recording ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Enregistrer mon message
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="p-6 flex items-center gap-4 bg-green-50">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800">Vidéo enregistrée ✅</p>
                <p className="text-sm text-green-600">Votre message sera accessible via le QR code du voucher</p>
              </div>
              <button
                className="text-xs text-slate-400 hover:text-slate-600 underline"
                onClick={() => setRecorded(false)}
              >
                Recommencer
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onBack}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Button>
        <Button
          color={brand.color}
          onClick={() => onNext({ hasVideoMessage: checked, videoRecorded: recorded })}
        >
          Voir le récapitulatif
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
