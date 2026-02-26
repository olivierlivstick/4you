import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

// GET /api/admin/test-logs — liste tous les tests (ordres payés ou en attente)
router.get('/', (req, res, next) => {
  try {
    const logs = db.prepare(`
      SELECT
        o.id,
        o.created_at,
        o.sender_name,
        o.sender_lastname,
        o.sender_email,
        o.recipient_name,
        o.recipient_lastname,
        o.recipient_email,
        o.amount,
        o.status,
        b.name  AS brand_name,
        b.color AS brand_color,
        b.photo AS brand_photo
      FROM orders o
      JOIN brands b ON o.brand_id = b.id
      ORDER BY o.created_at DESC
    `).all();
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/test-logs/:id — supprime un test
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
    if (!order) {
      const err = new Error('Test introuvable');
      err.status = 404;
      return next(err);
    }
    db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    res.json({ deleted: id });
  } catch (err) {
    next(err);
  }
});

export default router;
