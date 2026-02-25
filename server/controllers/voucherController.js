import db from '../db/database.js';

// GET /api/voucher/:id/video — returns data for the placeholder video page
export function getVoucherVideo(req, res, next) {
  try {
    const { id } = req.params;
    const order = db.prepare(`
      SELECT o.id, o.recipient_name, o.has_video_message, o.gift_code, o.status,
             b.name as brand_name, b.color as brand_color
      FROM orders o JOIN brands b ON o.brand_id = b.id
      WHERE o.id = ?
    `).get(id);
    if (!order) {
      const err = new Error('Commande introuvable');
      err.status = 404;
      return next(err);
    }
    res.json({
      orderId: order.id,
      recipientName: order.recipient_name,
      hasVideoMessage: order.has_video_message === 1,
      giftCode: order.gift_code,
      brandName: order.brand_name,
      brandColor: order.brand_color,
      status: order.status,
    });
  } catch (err) {
    next(err);
  }
}
