import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT, IS_PROD } from './config/env.js';
import { initSchema } from './db/schema.js';
import { seedBrands } from './db/seed.js';
import { errorHandler } from './middleware/errorHandler.js';

import brandsRouter from './routes/brands.js';
import ordersRouter from './routes/orders.js';
import voucherRouter from './routes/voucher.js';
import qrRouter from './routes/qr.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Boot sequence ──────────────────────────────────────────
initSchema();
seedBrands();

// ── Express setup ──────────────────────────────────────────
const app = express();

if (!IS_PROD) {
  app.use(cors({ origin: 'http://localhost:5173' }));
}
app.use(express.json());

// ── API routes ─────────────────────────────────────────────
app.use('/api/brands', brandsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/voucher', voucherRouter);
app.use('/api/qr', qrRouter);

// ── Production: serve React build ─────────────────────────
if (IS_PROD) {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Error handler (must be last) ──────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
