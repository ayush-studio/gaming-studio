import express from 'express';
import cors from 'cors';
import path from 'path';
import { createSchema } from './db/schema';
import gamesRoutes from './routes/games.routes';
import ordersRoutes from './routes/orders.routes';

// Initialize database schema
createSchema();

// Auto-seed if DB is empty
import db from './db/database';
const gameCount = (db.prepare('SELECT COUNT(*) as count FROM games').get() as { count: number }).count;
if (gameCount === 0) {
  console.log('🌱 Database empty — seeding games...');
  require('./db/seed');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for production Angular build)
app.use(express.static(path.join(__dirname, '../../client/dist/client')));

// API Routes
app.use('/api/games', gamesRoutes);
app.use('/api/orders', ordersRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all for Angular routing
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, '../../client/dist/client/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({ message: 'Gaming Studio API is running. Start Angular dev server separately on port 4200.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Gaming Studio Server running at http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/games\n`);
});

export default app;
