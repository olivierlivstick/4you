import { Router } from 'express';
import { generateQRBuffer } from '../services/qrService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'url query param required' });
    }
    const buffer = await generateQRBuffer(decodeURIComponent(url));
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

export default router;
