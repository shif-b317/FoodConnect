import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config.js';

if (!config.mongoUri || !config.jwtSecret || config.jwtSecret.length < 32) {
  console.error('Set MONGODB_URI and a JWT_SECRET of at least 32 characters in backend/.env.');
  process.exit(1);
}

try {
  await mongoose.connect(config.mongoUri);
  app.listen(config.port, () => console.log(`FOOD CONNECT API listening on port ${config.port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
