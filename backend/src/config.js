import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  emailProvider: process.env.EMAIL_PROVIDER || 'console',
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  publicAppUrl: process.env.PUBLIC_APP_URL || process.env.CLIENT_ORIGIN?.split(',')[0] || 'http://localhost:5173',
  trustProxyHops: Number.parseInt(process.env.TRUST_PROXY_HOPS || (process.env.NODE_ENV === 'production' ? '1' : '0'), 10),
};
