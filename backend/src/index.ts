import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { testConnection } from './config/db';
import logger from './utils/logger';
import { requestLogger, assignRequestId } from './middleware/requestLogger';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import participantRoutes from './routes/participantRoutes';

const app = express();

// Trust proxy if we are behind a reverse proxy (like Nginx on AWS)
app.set('trust proxy', 1);

// Middleware Stack
app.use(assignRequestId);
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(requestLogger); // Log all requests
app.use(globalLimiter); // Apply global rate limiting

// API Routes Version 1
const v1Router = express.Router();
v1Router.use('/auth', authRoutes);
v1Router.use('/events', eventRoutes);
v1Router.use('/events', participantRoutes);

app.use('/api/v1', v1Router);

// Backward compatibility redirect
app.use('/api', (req, res) => {
  res.redirect(301, `/api/v1${req.path}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

// Start server
const PORT = env.PORT || 5000;
app.listen(PORT, async () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  
  // Test database connection on startup
  await testConnection();
});
