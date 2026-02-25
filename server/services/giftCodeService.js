import { randomBytes } from 'crypto';

function generateSegment() {
  return randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
}

export function generateGiftCode() {
  return `GC-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}
