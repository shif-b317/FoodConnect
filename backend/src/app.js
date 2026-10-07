import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donations.js';
import notificationRoutes from './routes/notifications.js';
import { errorHandler } from './utils/errors.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.clientOrigin.split(',').map((origin) => origin.trim()) }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/v1/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }), authRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.get('/api/v1/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
app.use(errorHandler);

export default app;
