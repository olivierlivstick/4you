import db from '../db/database.js';
import { generateGiftCode } from '../services/giftCodeService.js';
import { generateQRBuffer } from '../services/qrService.js';
import { generateVoucher } from '../services/pdfService.js';
import { BASE_URL } from '../config/env.js';

// POST /api/orders
export function createOrder(req, res, next) {
  try {
    const { brand_id, amount, sender_name, sender_lastname, sender_email, recipient_email, recipient_name, recipient_lastname, personal_message, has_video_message } = req.body;

    // Validation
    if (!brand_id || !amount || !sender_email || !recipient_email || !recipient_name) {
      const err = new Error('Champs obligatoires manquants');
      err.status = 400;
      return next(err);
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 5 || parsedAmount > 500) {
      const err = new Error('Montant invalide (entre 5€ et 500€)');
      err.status = 400;
      return next(err);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sender_email)) {
      const err = new Error("Email de l'offrant invalide");
      err.status = 400;
      return next(err);
    }
    if (!emailRegex.test(recipient_email)) {
      const err = new Error('Email du destinataire invalide');
      err.status = 400;
      return next(err);
    }
    const brand = db.prepare('SELECT id FROM brands WHERE id = ?').get(brand_id);
    if (!brand) {
      const err = new Error('Enseigne introuvable');
      err.status = 404;
      return next(err);
    }

    // Insert with collision-safe gift code
    const insertStmt = db.prepare(`
      INSERT INTO orders (brand_id, amount, sender_name, sender_lastname, sender_email, recipient_email, recipient_name, recipient_lastname, personal_message, has_video_message, gift_code)
      VALUES (@brand_id, @amount, @sender_name, @sender_lastname, @sender_email, @recipient_email, @recipient_name, @recipient_lastname, @personal_message, @has_video_message, @gift_code)
    `);

    let giftCode, lastID;
    let inserted = false;
    while (!inserted) {
      giftCode = generateGiftCode();
      try {
        const result = insertStmt.run({
          brand_id,
          amount: parsedAmount,
          sender_name: (sender_name || '').trim(),
          sender_lastname: (sender_lastname || '').trim(),
          sender_email: sender_email.trim(),
          recipient_email: recipient_email.trim(),
          recipient_name: recipient_name.trim(),
          recipient_lastname: (recipient_lastname || '').trim(),
          personal_message: (personal_message || '').trim(),
          has_video_message: has_video_message ? 1 : 0,
          gift_code: giftCode,
        });
        lastID = result.lastInsertRowid;
        inserted = true;
      } catch (e) {
        if (!e.message.includes('UNIQUE')) throw e;
      }
    }

    const order = db.prepare(`
      SELECT o.*, b.name as brand_name, b.color as brand_color, b.category as brand_category, b.description as brand_description
      FROM orders o JOIN brands b ON o.brand_id = b.id
      WHERE o.id = ?
    `).get(lastID);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/orders/:id/pay
export function payOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      const err = new Error('Commande introuvable');
      err.status = 404;
      return next(err);
    }
    if (order.status !== 'pending') {
      const err = new Error('Cette commande a déjà été payée');
      err.status = 400;
      return next(err);
    }
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('paid', id);
    const updated = db.prepare(`
      SELECT o.*, b.name as brand_name, b.color as brand_color, b.category as brand_category, b.description as brand_description
      FROM orders o JOIN brands b ON o.brand_id = b.id
      WHERE o.id = ?
    `).get(id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
export function getOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = db.prepare(`
      SELECT o.*, b.name as brand_name, b.color as brand_color, b.category as brand_category, b.description as brand_description
      FROM orders o JOIN brands b ON o.brand_id = b.id
      WHERE o.id = ?
    `).get(id);
    if (!order) {
      const err = new Error('Commande introuvable');
      err.status = 404;
      return next(err);
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id/voucher-pdf
export async function getVoucherPdf(req, res, next) {
  try {
    const { id } = req.params;
    const order = db.prepare(`
      SELECT o.*, b.name as brand_name, b.color as brand_color, b.category as brand_category, b.description as brand_description
      FROM orders o JOIN brands b ON o.brand_id = b.id
      WHERE o.id = ?
    `).get(id);
    if (!order) {
      const err = new Error('Commande introuvable');
      err.status = 404;
      return next(err);
    }

    const videoUrl = `${BASE_URL}/voucher/${id}/video`;
    const qrBuffer = await generateQRBuffer(videoUrl);

    const brand = {
      name: order.brand_name,
      color: order.brand_color,
      category: order.brand_category,
      description: order.brand_description,
    };

    const pdfBytes = await generateVoucher({ order, brand, qrBuffer });

    const filename = `voucher-${order.gift_code}.pdf`;
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
}
