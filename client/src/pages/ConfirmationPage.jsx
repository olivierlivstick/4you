import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderStore } from '../store/orderStore';
import { getOrder } from '../api/client';
import VoucherCard from '../components/confirmation/VoucherCard';
import { motion } from 'framer-motion';

export default function ConfirmationPage() {
  const { t } = useTranslation();
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-medium bg-red-50 p-4 rounded-2xl">{error || t('confirmation.not_found')}</p>
        <Link to="/" className="mt-6 inline-block text-primary-600 font-bold hover:underline transition-all">
          {t('confirmation.back_home')}
        </Link>
      </div>
    );
  }

  const pdfUrl = `/api/orders/${orderId}/voucher-pdf`;
  const formatAmount = (amount) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl mix-blend-multiply opacity-20"
          style={{ backgroundColor: order.brand_color }} />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-4 w-full relative z-10"
      >
        {/* Success banner */}
        <div className="text-center mb-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mb-6 shadow-xl shadow-green-500/30 border-4 border-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight"
          >
            {t('confirmation.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-slate-500 text-lg leading-relaxed max-w-md"
            dangerouslySetInnerHTML={{
              __html: t('confirmation.subtitle', {
                brand: order.brand_name,
                amount: formatAmount(order.amount),
                name: order.recipient_name,
                brandColor: order.brand_color,
              })
            }}
          />
        </div>

        {/* Voucher */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: 'spring' }}
        >
          <VoucherCard order={order} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-white shadow-xl transition-all hover:-translate-y-1 active:scale-95 group"
            style={{
              background: `linear-gradient(135deg, ${order.brand_color}, ${order.brand_color}dd)`,
              boxShadow: `0 12px 24px -8px ${order.brand_color}60`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('confirmation.download_pdf')}
          </a>
          <Link
            to="/"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold border-2 border-slate-200/60 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-1 active:scale-95"
          >
            {t('confirmation.offer_another')}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="text-center text-xs text-slate-400 mt-8 font-medium"
        >
          {t('confirmation.demo_notice')}
        </motion.p>
      </motion.div>
    </div>
  );
}
