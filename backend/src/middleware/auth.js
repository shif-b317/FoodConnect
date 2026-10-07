import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';

export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ success: false, error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user || user.status !== 'ACTIVE') return res.status(401).json({ success: false, error: { code: 'INVALID_SESSION', message: 'This session is no longer valid.' } });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'The access token is invalid or expired.' } });
  }
}

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Your account role cannot perform this action.' } });
  next();
};
