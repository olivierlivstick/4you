import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { getOrder } from '../api/client';
import VoucherCard from '../components/confirmation/VoucherCard';

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const paidOrder = useOrderStore((s) => s.paidOrder);
  const reset = useOrderStore((s) => s.reset);
  const [order, setOrder] = useState(paidOrder?.id === parseInt(orderId) ? paidOrder : null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order) {
      getOrder(orderId)
        .then(setOrder)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-medium">{error || 'Commande introuvable'}</p>
        <Link to="/" className="mt-4 inline-block text-violet-600 underline text-sm">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const pdfUrl = `/api/orders/${orderId}/voucher-pdf`;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Success banner */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Cadeau envoyé !</h1>
        <p className="text-slate-500">
          Votre carte cadeau <strong className="text-slate-700">{order.brand_name}</strong> de{' '}
          <strong className="text-slate-700">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(order.amount)}
          </strong>{' '}
          est prête pour <strong className="text-slate-700">{order.recipient_name}</strong>.
        </p>
      </div>

      {/* Voucher */}
      <VoucherCard order={order} />

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={pdfUrl}
          download
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: order.brand_color }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger en PDF
        </a>
        <Link
          to="/"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
        >
          Offrir une autre carte
        </Link>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Site de démonstration — aucun paiement réel n'a été effectué
      </p>
    </div>
  );
}
