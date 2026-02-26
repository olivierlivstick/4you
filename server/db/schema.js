import db from './database.js';

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      color TEXT NOT NULL,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL REFERENCES brands(id),
      amount REAL NOT NULL,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      personal_message TEXT DEFAULT '',
      has_video_message INTEGER NOT NULL DEFAULT 0,
      video_id TEXT,
      gift_code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  // Migrations idempotentes
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN sender_email TEXT DEFAULT ''`);
  } catch (_) { /* column already exists */ }

  try {
    db.exec(`ALTER TABLE orders ADD COLUMN sender_name TEXT DEFAULT ''`);
  } catch (_) { /* column already exists */ }

  try {
    db.exec(`ALTER TABLE orders ADD COLUMN sender_lastname TEXT DEFAULT ''`);
  } catch (_) { /* column already exists */ }

  try {
    db.exec(`ALTER TABLE orders ADD COLUMN recipient_lastname TEXT DEFAULT ''`);
  } catch (_) { /* column already exists */ }

  try {
    db.exec(`ALTER TABLE brands ADD COLUMN photo TEXT DEFAULT ''`);
  } catch (_) { /* column already exists */ }

  console.log('✅ Schema initialized');
}
