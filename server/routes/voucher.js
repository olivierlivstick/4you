import { Router } from 'express';
import { getVoucherVideo } from '../controllers/voucherController.js';

const router = Router();

router.get('/:id/video', getVoucherVideo);

export default router;
