import QRCode from 'qrcode';

export async function generateQRBuffer(url) {
  return QRCode.toBuffer(url, {
    type: 'png',
    width: 300,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}
