import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config.js';
import { HttpError } from '../utils/errors.js';

const router = Router();
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, organization: user.organization, createdAt: user.createdAt });
const issueToken = (user) => jwt.sign({}, config.jwtSecret, { subject: user.id, expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const { fullName, name, email, password, role, phone = '', organization = '' } = req.body || {};
  const normalizedRole = String(role || '').toLowerCase();
  if (!String(fullName || name || '').trim() || !/^\S+@\S+\.\S+$/.test(String(email || '')) || String(password || '').length < 8 || !['donor', 'ngo', 'volunteer'].includes(normalizedRole)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Provide a name, valid email, password of at least 8 characters, and a supported role.');
  }
  const user = await User.create({ name: String(fullName || name).trim(), email, passwordHash: await bcrypt.hash(password, 12), role: normalizedRole, phone, organization });
  res.status(201).json({ success: true, data: { user: publicUser(user), token: issueToken(user) }, message: 'Account created successfully.' });
});

router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(String(req.body?.password || ''), user.passwordHash))) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  if (user.status !== 'ACTIVE') throw new HttpError(403, 'ACCOUNT_SUSPENDED', 'This account is suspended.');
  res.json({ success: true, data: { user: publicUser(user), token: issueToken(user) }, message: 'Signed in successfully.' });
});

router.get('/me', authenticate, (req, res) => res.json({ success: true, data: { user: publicUser(req.user) } }));

export default router;
