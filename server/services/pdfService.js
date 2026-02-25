import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return rgb(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  );
}

// Lighten a color by blending with white
function hexToRgbLight(hex, alpha = 0.12) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return rgb(r + (1 - r) * (1 - alpha), g + (1 - g) * (1 - alpha), b + (1 - b) * (1 - alpha));
}

// Format date in French
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export async function generateVoucher({ order, brand, qrBuffer }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const brandColor = hexToRgb(brand.color);
  const brandLight = hexToRgbLight(brand.color);
  const white = rgb(1, 1, 1);
  const darkGray = rgb(0.13, 0.18, 0.3);
  const midGray = rgb(0.45, 0.52, 0.62);
  const lightGray = rgb(0.92, 0.94, 0.97);

  const margin = 40;
  const contentWidth = width - margin * 2;

  // ── Header band ──────────────────────────────────────────
  const headerHeight = 145;
  page.drawRectangle({
    x: 0, y: height - headerHeight,
    width, height: headerHeight,
    color: brandColor,
  });

  // Brand name
  const brandFontSize = 38;
  page.drawText(brand.name.toUpperCase(), {
    x: margin, y: height - 70,
    font: fontBold, size: brandFontSize, color: white,
  });

  // Category badge (white pill)
  const badgeText = brand.category;
  const badgeW = font.widthOfTextAtSize(badgeText, 11) + 20;
  page.drawRectangle({
    x: margin, y: height - 115,
    width: badgeW, height: 22,
    color: rgb(1, 1, 1, 0.22),
    borderColor: white,
    borderWidth: 1,
    borderOpacity: 0.5,
  });
  page.drawText(badgeText, {
    x: margin + 10, y: height - 108,
    font, size: 11, color: white,
  });

  // Subtitle
  page.drawText('CARTE CADEAU NUMÉRIQUE', {
    x: margin, y: height - 170,
    font: fontBold, size: 10,
    color: midGray,
    letterSpacing: 2,
  });

  // ── Main content ─────────────────────────────────────────
  // Amount (large)
  const amountStr = `${Number(order.amount).toFixed(2).replace('.', ',')} €`;
  page.drawText(amountStr, {
    x: margin, y: height - 230,
    font: fontBold, size: 52, color: brandColor,
  });

  // Recipient line
  page.drawText('Pour :', {
    x: margin, y: height - 275,
    font, size: 13, color: midGray,
  });
  page.drawText(order.recipient_name, {
    x: margin + 45, y: height - 275,
    font: fontBold, size: 14, color: darkGray,
  });

  // QR code (top right)
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  const qrSize = 120;
  const qrX = width - margin - qrSize;
  const qrY = height - 295;
  // QR frame
  page.drawRectangle({
    x: qrX - 6, y: qrY - 6,
    width: qrSize + 12, height: qrSize + 12,
    color: lightGray,
    borderColor: hexToRgbLight(brand.color, 0.3),
    borderWidth: 1,
  });
  page.drawImage(qrImage, {
    x: qrX, y: qrY,
    width: qrSize, height: qrSize,
  });
  page.drawText('Scannez pour', {
    x: qrX - 2, y: qrY - 18,
    font, size: 8, color: midGray,
  });
  page.drawText('votre vidéo', {
    x: qrX + 2, y: qrY - 28,
    font, size: 8, color: midGray,
  });

  // ── Gift code box ─────────────────────────────────────────
  const codeBoxY = height - 340;
  const codeBoxH = 52;
  page.drawRectangle({
    x: margin, y: codeBoxY,
    width: contentWidth - qrSize - 20, height: codeBoxH,
    color: brandLight,
    borderColor: brandColor,
    borderWidth: 1.5,
  });
  page.drawText('CODE CADEAU', {
    x: margin + 14, y: codeBoxY + codeBoxH - 14,
    font, size: 8, color: midGray, letterSpacing: 1.5,
  });
  page.drawText(order.gift_code, {
    x: margin + 14, y: codeBoxY + 12,
    font: fontBold, size: 20, color: brandColor,
  });

  // ── Divider ───────────────────────────────────────────────
  const divY = height - 380;
  page.drawLine({
    start: { x: margin, y: divY },
    end: { x: width - margin, y: divY },
    thickness: 1,
    color: lightGray,
  });

  // ── Personal message ──────────────────────────────────────
  let currentY = divY - 25;
  if (order.personal_message) {
    page.drawText('Message personnel :', {
      x: margin, y: currentY,
      font: fontBold, size: 11, color: darkGray,
    });
    currentY -= 18;
    // Word-wrap the message
    const words = order.personal_message.split(' ');
    const maxLineWidth = contentWidth - 20;
    let line = '';
    const lines = [];
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, 11) > maxLineWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    for (const l of lines.slice(0, 4)) {
      page.drawText(l, {
        x: margin + 10, y: currentY,
        font: fontOblique, size: 11, color: midGray,
      });
      currentY -= 16;
    }
    currentY -= 8;
  }

  // ── Video badge (conditional) ─────────────────────────────
  if (order.has_video_message) {
    const vBadgeW = 220;
    page.drawRectangle({
      x: margin, y: currentY - 24,
      width: vBadgeW, height: 28,
      color: brandLight,
      borderColor: brandColor,
      borderWidth: 1.5,
    });
    page.drawText('Message vidéo personnalisé inclus', {
      x: margin + 10, y: currentY - 16,
      font: fontBold, size: 10, color: brandColor,
    });
    currentY -= 45;
  }

  // ── Footer ────────────────────────────────────────────────
  const footerY = 55;
  page.drawLine({
    start: { x: margin, y: footerY + 22 },
    end: { x: width - margin, y: footerY + 22 },
    thickness: 0.5, color: lightGray,
  });

  const dateStr = formatDate(order.created_at);
  page.drawText(`Émis le ${dateStr}`, {
    x: margin, y: footerY,
    font, size: 9, color: midGray,
  });
  page.drawText('4you © 2026', {
    x: width - margin - font.widthOfTextAtSize('4you © 2026', 9),
    y: footerY,
    font: fontBold, size: 9, color: midGray,
  });
  page.drawText(
    'Ce voucher est valable jusqu\'à épuisement du solde. Non remboursable.',
    {
      x: margin, y: footerY + 12,
      font, size: 8, color: midGray,
    }
  );

  // ── Decorative accent bar (bottom of header on left) ──────
  page.drawRectangle({
    x: 0, y: height - headerHeight - 4,
    width: 80, height: 4,
    color: brandColor,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
