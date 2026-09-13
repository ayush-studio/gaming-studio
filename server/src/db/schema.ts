import db from './database';

export function createSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      slug              TEXT UNIQUE NOT NULL,
      title             TEXT NOT NULL,
      genre             TEXT NOT NULL,
      tagline           TEXT NOT NULL,
      description       TEXT NOT NULL,
      price             REAL NOT NULL,
      discount_percent  INTEGER DEFAULT 0,
      rating            REAL DEFAULT 0,
      badge             TEXT DEFAULT '',
      thumbnail_url     TEXT NOT NULL,
      trailer_url       TEXT DEFAULT '',
      screenshots_json  TEXT DEFAULT '[]',
      system_reqs_json  TEXT DEFAULT '{}',
      tags_json         TEXT DEFAULT '[]',
      release_date      TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number     TEXT UNIQUE NOT NULL,
      customer_name    TEXT NOT NULL,
      customer_email   TEXT NOT NULL,
      total_amount     REAL NOT NULL,
      status           TEXT DEFAULT 'completed',
      items_json       TEXT DEFAULT '[]',
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Database schema created/verified.');
}
