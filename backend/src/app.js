import express from 'express';
import { randomUUID } from 'node:crypto';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donations.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import impactRoutes from './routes/impact.js';
import { errorHandler } from './utils/errors.js';

const app = express();
app.disable('x-powered-by');
if (config.trustProxyHops > 0) app.set('trust proxy', config.trustProxyHops);
app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  const startedAt = Date.now();
  res.on('finish', () => console.info(JSON.stringify({
    type: 'http_request', requestId: req.requestId, method: req.method,
    path: req.originalUrl.split('?')[0], status: res.statusCode, durationMs: Date.now() - startedAt,
  })));
  next();
});
app.use(helmet());
app.use(cors({ origin: config.clientOrigin.split(',').map((origin) => origin.trim()) }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/v1/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }), authRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/impact', impactRoutes);
app.get('/api/v1/live', (req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.get('/api/v1/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ success: connected, data: { status: connected ? 'ok' : 'degraded', database: connected ? 'connected' : 'disconnected' } });
});
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
app.use(errorHandler);

export default app;
