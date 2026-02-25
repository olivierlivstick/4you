import 'dotenv/config';

export const PORT = parseInt(process.env.PORT || '3001', 10);
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PROD = NODE_ENV === 'production';
