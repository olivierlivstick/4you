import { Router } from 'express';
import { createOrder, payOrder, getOrder, getVoucherPdf } from '../controllers/ordersController.js';

const router = Router();

router.post('/', createOrder);
router.patch('/:id/pay', payOrder);
router.get('/:id', getOrder);
router.get('/:id/voucher-pdf', getVoucherPdf);

export default router;
