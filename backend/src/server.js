import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config.js';

if (!config.mongoUri || !config.jwtSecret || config.jwtSecret.length < 32) {
  console.error('Set MONGODB_URI and a JWT_SECRET of at least 32 characters in backend/.env.');
  process.exit(1);
}
if (!Number.isInteger(config.trustProxyHops) || config.trustProxyHops < 0) {
  console.error('TRUST_PROXY_HOPS must be a non-negative integer.');
  process.exit(1);
}
if (config.nodeEnv === 'production' && (config.emailProvider !== 'resend' || !config.resendApiKey || !config.emailFrom)) {
  console.error('Production requires EMAIL_PROVIDER=resend, RESEND_API_KEY, and EMAIL_FROM.');
  process.exit(1);
}
if (config.nodeEnv === 'production' && (config.clientOrigin.split(',').some((origin) => !origin.trim().startsWith('https://')) || !config.publicAppUrl.startsWith('https://') || /localhost|127\.0\.0\.1/.test(config.mongoUri))) {
  console.error('Production requires HTTPS CLIENT_ORIGIN and PUBLIC_APP_URL, plus a remote MongoDB URI.');
  process.exit(1);
}

try {
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  const server = app.listen(config.port, '0.0.0.0', () => console.log(`FOOD CONNECT API listening on port ${config.port}`));
  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}; closing FOOD CONNECT API.`);
    server.close(async (error) => {
      if (error) console.error('Could not close HTTP server cleanly:', error.message);
      await mongoose.disconnect();
      process.exit(error ? 1 : 0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
