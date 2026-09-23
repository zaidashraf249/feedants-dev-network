import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import connectDB, { dbState } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import circleRoutes from './routes/circleRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Core middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ---------------------------------------------------------------------------
// Health check — also reports whether we're on live MongoDB or mock data
// ---------------------------------------------------------------------------
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Feedants API is running',
    dataSource: dbState.isConnected ? 'mongodb' : 'in-memory-mock',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/circles', circleRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[server] Feedants API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    console.log(`[server] Data source: ${dbState.isConnected ? 'MongoDB' : 'in-memory mock store'}`);
  });
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('[fatal] Unhandled promise rejection:', err.message);
});

// backend/server.js mein add karein
import seedDatabase from './utils/seed.js'; // Ensure seed.js exports the function

app.get('/api/v1/admin/seed-db-now', async (req, res) => {
  try {
    // Basic secret key protection
    if (req.query.secret !== 'zaid_seed_2026') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // Call seed logic
    await seedDatabase();
    res.status(200).json({ success: true, message: 'Production Database successfully seeded!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;
