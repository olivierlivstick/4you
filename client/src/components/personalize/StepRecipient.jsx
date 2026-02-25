import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MSG = 200;

export default function StepRecipient({ brand, initialData, onNext, onBack }) {
  const [email, setEmail] = useState(initialData?.email || '');
  const [name, setName] = useState(initialData?.name || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "L'email est obligatoire";
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Format email invalide';
    if (!name.trim()) e.name = 'Le prénom est obligatoire';
    if (message.length > MAX_MSG) e.message = `Maximum ${MAX_MSG} caractères`;
    return e;
  }

  function handleNext() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onNext({ email: email.trim(), name: name.trim(), message: message.trim() });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Pour qui est ce cadeau ?</h2>
      <p className="text-slate-500 mb-6">Le destinataire recevra le voucher à cette adresse</p>

      <div className="flex flex-col gap-4 mb-6">
        <Input
          label="Prénom du destinataire *"
          type="text"
          placeholder="Marie"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
          error={errors.name}
        />
        <Input
          label="Email du destinataire *"
          type="email"
          placeholder="marie@exemple.fr"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
          error={errors.email}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Message personnel (optionnel)</label>
          <textarea
            rows={3}
            placeholder="Joyeux anniversaire ! Ce cadeau est pour toi..."
            value={message}
            onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
            maxLength={MAX_MSG + 10}
            className={`w-full px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm resize-none transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
              errors.message ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          />
          <div className="flex justify-between items-center">
            {errors.message ? (
              <p className="text-xs text-red-500">{errors.message}</p>
            ) : (
              <span />
            )}
            <span className={`text-xs ml-auto ${message.length > MAX_MSG ? 'text-red-500' : 'text-slate-400'}`}>
              {message.length}/{MAX_MSG}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onBack}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Button>
        <Button color={brand.color} onClick={handleNext}>
          Continuer
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
