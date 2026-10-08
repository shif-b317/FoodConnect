import { Router } from 'express';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
import { notify } from '../services/notifications.js';
import { HttpError } from '../utils/errors.js';

const router = Router();
router.use(authenticate, allowRoles('admin'));

const applicationView = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  organization: user.organization,
  registrationNumber: user.registrationNumber,
  verificationEvidenceUrl: user.verificationEvidenceUrl || '',
  verificationStatus: user.verificationStatus || 'PENDING',
  verificationNote: user.verificationNote || '',
  createdAt: user.createdAt,
  verificationReviewedAt: user.verificationReviewedAt,
});

router.get('/ngos', async (req, res) => {
  const requestedStatus = String(req.query.status || 'PENDING').toUpperCase();
  if (requestedStatus !== 'ALL' && !['PENDING', 'VERIFIED', 'REJECTED'].includes(requestedStatus)) {
    throw new HttpError(400, 'INVALID_VERIFICATION_STATUS', 'Choose PENDING, VERIFIED, REJECTED, or ALL.');
  }
  const statusQuery = requestedStatus === 'ALL'
    ? {}
    : requestedStatus === 'PENDING'
      ? { $or: [{ verificationStatus: 'PENDING' }, { verificationStatus: { $exists: false } }] }
      : { verificationStatus: requestedStatus };
  const ngoQuery = { role: 'ngo', ...statusQuery };
  const [items, pending, verified, rejected] = await Promise.all([
    User.find(ngoQuery).sort({ createdAt: -1 }).limit(200),
    User.countDocuments({ role: 'ngo', $or: [{ verificationStatus: 'PENDING' }, { verificationStatus: { $exists: false } }] }),
    User.countDocuments({ role: 'ngo', verificationStatus: 'VERIFIED' }),
    User.countDocuments({ role: 'ngo', verificationStatus: 'REJECTED' }),
  ]);
  res.json({ success: true, data: { items: items.map(applicationView), counts: { pending, verified, rejected } } });
});

router.get('/metrics', async (req, res) => {
  const [users, donations, completed, verifiedNgos] = await Promise.all([
    User.aggregate([
      { $match: { status: 'ACTIVE' } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    Donation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Donation.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, mealsServed: { $sum: '$estimatedMeals' }, completedDeliveries: { $sum: 1 } } },
    ]),
    User.countDocuments({ role: 'ngo', status: 'ACTIVE', verificationStatus: 'VERIFIED' }),
  ]);
  const countByRole = Object.fromEntries(users.map(({ _id, count }) => [_id, count]));
  const countByStatus = Object.fromEntries(donations.map(({ _id, count }) => [_id, count]));
  const completedMeals = completed[0]?.mealsServed || 0;
  const completedDeliveries = completed[0]?.completedDeliveries || 0;
  const totalDonations = Object.values(countByStatus).reduce((sum, count) => sum + count, 0);
  res.json({ success: true, data: {
    totalUsers: Object.values(countByRole).reduce((sum, count) => sum + count, 0),
    registeredVolunteers: countByRole.volunteer || 0,
    verifiedNgos,
    totalDonations,
    availableDonations: countByStatus.AVAILABLE || 0,
    completedDeliveries,
    mealsServed: completedMeals,
    completionRate: totalDonations ? Math.round((completedDeliveries / totalDonations) * 1000) / 10 : 0,
    donationStatuses: countByStatus,
  } });
});

router.patch('/ngos/:id/verification', async (req, res) => {
  const status = String(req.body?.status || '').toUpperCase();
  const note = String(req.body?.note || '').trim();
  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    throw new HttpError(400, 'INVALID_VERIFICATION_STATUS', 'Set the verification status to VERIFIED or REJECTED.');
  }
  if (status === 'REJECTED' && !note) {
    throw new HttpError(400, 'REVIEW_NOTE_REQUIRED', 'Add a short reason when rejecting an NGO application.');
  }
  if (note.length > 1000) throw new HttpError(400, 'VALIDATION_ERROR', 'The review note must be 1000 characters or fewer.');

  const ngo = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'ngo' },
    { $set: { verificationStatus: status, verificationNote: note, verificationReviewedAt: new Date() } },
    { returnDocument: 'after', runValidators: true },
  );
  if (!ngo) throw new HttpError(404, 'NGO_NOT_FOUND', 'NGO application not found.');
  await notify({
    userId: ngo.id,
    role: 'ngo',
    title: status === 'VERIFIED' ? 'NGO Application Verified' : 'NGO Application Update',
    message: status === 'VERIFIED'
      ? 'Your NGO is verified and can now accept donations.'
      : `Your NGO application was not approved. Review note: ${note}`,
  });
  res.json({ success: true, data: { ngo: applicationView(ngo) }, message: `NGO application ${status.toLowerCase()}.` });
});

export default router;
