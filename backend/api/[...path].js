import mongoose from 'mongoose';
import app from '../src/app.js';
import { config } from '../src/config.js';

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!config.mongoUri || !config.jwtSecret || config.jwtSecret.length < 32) {
    throw new Error('MONGODB_URI and a JWT_SECRET of at least 32 characters are required.');
  }

  connectionPromise ??= mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
    return res.status(503).json({
      success: false,
      error: { code: 'DATABASE_UNAVAILABLE', message: 'The API database is unavailable.' },
    });
  }
}
