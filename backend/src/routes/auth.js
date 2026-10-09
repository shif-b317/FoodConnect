import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config.js';
import { HttpError } from '../utils/errors.js';
import { sendEmail } from '../services/email.js';
import { notify } from '../services/notifications.js';

const router = Router();
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, organization: user.organization, registrationNumber: user.registrationNumber, verificationEvidenceUrl: user.verificationEvidenceUrl || '', verificationStatus: user.verificationStatus || (user.role === 'ngo' ? 'PENDING' : 'NOT_REQUIRED'), verificationNote: user.verificationNote || '', notificationPreferences: user.notificationPreferences || { email: true }, createdAt: user.createdAt });
const issueToken = (user) => jwt.sign({ ver: user.tokenVersion || 0 }, config.jwtSecret, { subject: user.id, expiresIn: '7d' });
const tokenHash = (token) => createHash('sha256').update(token).digest('hex');
const sensitiveActionLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });

router.post('/register', async (req, res) => {
  const { fullName, name, email, password, role, phone = '', organization = '', registrationNumber = '', verificationEvidenceUrl = '' } = req.body || {};
  const normalizedRole = String(role || '').toLowerCase();
  const evidenceUrl = String(verificationEvidenceUrl || '').trim();
  let validEvidenceUrl = false;
  try { validEvidenceUrl = new URL(evidenceUrl).protocol === 'https:'; } catch { validEvidenceUrl = false; }
  if (!String(fullName || name || '').trim() || !/^\S+@\S+\.\S+$/.test(String(email || '').trim()) || String(password || '').length < 8 || !['donor', 'ngo', 'volunteer'].includes(normalizedRole) || (normalizedRole === 'ngo' && (!String(organization).trim() || !String(registrationNumber).trim() || !validEvidenceUrl)) || (normalizedRole !== 'ngo' && (registrationNumber || verificationEvidenceUrl))) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Provide a name, valid email, password of at least 8 characters, and a supported role. NGO accounts also require an organization name, registration number, and valid HTTPS registration document link.');
  }
  const user = await User.create({ name: String(fullName || name).trim(), email: String(email).trim().toLowerCase(), passwordHash: await bcrypt.hash(password, 12), role: normalizedRole, phone: String(phone).trim(), organization: String(organization).trim(), registrationNumber: String(registrationNumber).trim(), verificationEvidenceUrl: evidenceUrl });
  res.status(201).json({ success: true, data: { user: publicUser(user), token: issueToken(user) }, message: 'Account created successfully.' });
});

router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(String(req.body?.password || ''), user.passwordHash))) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  if (user.status !== 'ACTIVE') throw new HttpError(403, 'ACCOUNT_SUSPENDED', 'This account is suspended.');
  res.json({ success: true, data: { user: publicUser(user), token: issueToken(user) }, message: 'Signed in successfully.' });
});

router.patch('/me', authenticate, async (req, res) => {
  const allowed = ['name', 'phone', 'organization', 'registrationNumber', 'verificationEvidenceUrl'];
  if (Object.keys(req.body || {}).some((key) => !allowed.includes(key))) {
    throw new HttpError(400, 'INVALID_PROFILE_FIELD', 'Only name, phone, organization, registration number, and verification evidence link can be updated.');
  }
  const user = req.user;
  const wasNgo = user.role === 'ngo';
  if (!wasNgo && ['registrationNumber', 'verificationEvidenceUrl'].some((key) => Object.hasOwn(req.body || {}, key))) {
    throw new HttpError(400, 'INVALID_PROFILE_FIELD', 'Registration evidence is only available for NGO accounts.');
  }
  let verificationDetailsChanged = false;
  if (Object.hasOwn(req.body || {}, 'name')) {
    const name = String(req.body.name || '').trim();
    if (!name || name.length > 100) throw new HttpError(400, 'VALIDATION_ERROR', 'Name must contain between 1 and 100 characters.');
    user.name = name;
  }
  if (Object.hasOwn(req.body || {}, 'phone')) user.phone = String(req.body.phone || '').trim();
  if (Object.hasOwn(req.body || {}, 'organization')) {
    const organization = String(req.body.organization || '').trim();
    if (organization.length > 150 || (wasNgo && !organization)) throw new HttpError(400, 'VALIDATION_ERROR', 'Provide a valid organization name.');
    verificationDetailsChanged ||= wasNgo && organization !== user.organization;
    user.organization = organization;
  }
  if (Object.hasOwn(req.body || {}, 'registrationNumber')) {
    const registrationNumber = String(req.body.registrationNumber || '').trim();
    if (registrationNumber.length > 80 || (wasNgo && !registrationNumber)) throw new HttpError(400, 'VALIDATION_ERROR', 'Provide a valid NGO registration number.');
    verificationDetailsChanged ||= wasNgo && registrationNumber !== user.registrationNumber;
    user.registrationNumber = registrationNumber;
  }
  if (Object.hasOwn(req.body || {}, 'verificationEvidenceUrl')) {
    const evidenceUrl = String(req.body.verificationEvidenceUrl || '').trim();
    let validEvidenceUrl = !evidenceUrl;
    try { validEvidenceUrl ||= new URL(evidenceUrl).protocol === 'https:'; } catch { validEvidenceUrl = false; }
    if (!validEvidenceUrl || evidenceUrl.length > 2048) throw new HttpError(400, 'VALIDATION_ERROR', 'Verification evidence must be a valid HTTPS link.');
    verificationDetailsChanged ||= wasNgo && evidenceUrl !== user.verificationEvidenceUrl;
    user.verificationEvidenceUrl = evidenceUrl;
  }
  if (verificationDetailsChanged) {
    user.verificationStatus = 'PENDING';
    user.verificationNote = '';
    user.verificationReviewedAt = undefined;
  }
  await user.save();
  if (verificationDetailsChanged) {
    await notify({ role: 'admin', title: 'NGO Details Updated', message: `${user.organization} updated its verification details and needs review.` });
  }
  res.json({ success: true, data: { user: publicUser(user) }, message: 'Profile updated successfully.' });
});

router.patch('/me/preferences', authenticate, async (req, res) => {
  const email = req.body?.email;
  if (typeof email !== 'boolean' || Object.keys(req.body || {}).some((key) => key !== 'email')) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Provide an email boolean preference.');
  }
  req.user.notificationPreferences.email = email;
  await req.user.save();
  res.json({ success: true, data: { user: publicUser(req.user) }, message: 'Notification preferences updated.' });
});

router.patch('/me/password', authenticate, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');
  if (newPassword.length < 8) throw new HttpError(400, 'VALIDATION_ERROR', 'New password must be at least 8 characters.');
  const user = await User.findById(req.user.id).select('+passwordHash');
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) throw new HttpError(400, 'CURRENT_PASSWORD_INCORRECT', 'Current password is incorrect.');
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordChangedAt = new Date();
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
  res.json({ success: true, message: 'Password changed. Sign in again on other devices.' });
});

router.post('/forgot-password', sensitiveActionLimiter, async (req, res) => {
  const genericMessage = 'If an account exists for that email, password reset instructions have been sent.';
  const email = String(req.body?.email || '').toLowerCase().trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.json({ success: true, message: genericMessage });
  const user = await User.findOne({ email });
  if (!user || user.status !== 'ACTIVE') return res.json({ success: true, message: genericMessage });
  const token = randomBytes(32).toString('hex');
  user.passwordResetTokenHash = tokenHash(token);
  user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();
  const resetUrl = `${config.publicAppUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your FOOD CONNECT password',
      text: `Use this link within 30 minutes to set a new password: ${resetUrl}\nIf you did not request this, ignore this email.`,
      html: `<p>Use this link within 30 minutes to set a new password:</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, ignore this email.</p>`,
    });
  } catch (error) {
    console.error('Could not send password reset email:', error.message);
  }
  res.json({ success: true, message: genericMessage, ...(config.nodeEnv !== 'production' && user ? { data: { devResetUrl: resetUrl } } : {}) });
});

router.post('/reset-password', sensitiveActionLimiter, async (req, res) => {
  const token = String(req.body?.token || '');
  const password = String(req.body?.password || '');
  if (token.length !== 64 || password.length < 8) throw new HttpError(400, 'VALIDATION_ERROR', 'Provide a valid reset token and a password of at least 8 characters.');
  const user = await User.findOne({ passwordResetTokenHash: tokenHash(token), passwordResetExpiresAt: { $gt: new Date() }, status: 'ACTIVE' }).select('+passwordHash +passwordResetTokenHash +passwordResetExpiresAt');
  if (!user) throw new HttpError(400, 'RESET_TOKEN_INVALID', 'This reset link is invalid or has expired. Request a new one.');
  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordChangedAt = new Date();
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
  res.json({ success: true, message: 'Password reset successfully. You can now sign in.' });
});

router.get('/me', authenticate, (req, res) => res.json({ success: true, data: { user: publicUser(req.user) } }));

export default router;
