import { Router } from 'express';
import Donation from '../models/Donation.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
import { HttpError } from '../utils/errors.js';
import { notify } from '../services/notifications.js';

const router = Router();
router.use(authenticate);

router.post('/', allowRoles('donor'), async (req, res) => {
  const data = req.body || {};
  const donation = await Donation.create({
    donorId: req.user.id, donorName: req.user.name, donorPhone: req.user.phone,
    eventName: data.eventName, eventType: data.eventType, foodType: data.foodType,
    description: data.description, quantity: data.quantity,
    estimatedMeals: Number(data.estimatedMeals), preparationTime: data.preparationTime,
    pickupLocation: { address: data.address || data.pickupLocation?.address, city: data.city || data.pickupLocation?.city, postalCode: data.postalCode || data.pickupLocation?.postalCode, coordinates: data.pickupLocation?.coordinates },
    pickupWindow: data.pickupWindow || { from: data.pickupFrom, to: data.pickupTo, date: data.pickupDate },
    foodSafetyInfo: data.foodSafetyInfo || { temperatureMaintained: data.temperatureMaintained, containerType: data.containerType, allergens: data.allergens },
    imageUrl: data.imageUrl,
  });
  res.status(201).json({ success: true, data: { donation }, message: 'Donation created successfully.' });
});

router.get('/', async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.city) filter['pickupLocation.city'] = new RegExp(`^${String(req.query.city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  if (req.user.role === 'donor') filter.donorId = req.user.id;
  if (req.user.role === 'ngo') {
    filter.$or = req.user.verificationStatus === 'VERIFIED'
      ? [{ status: 'AVAILABLE' }, { ngoId: req.user.id }]
      : [{ ngoId: req.user.id }];
  }
  if (req.user.role === 'volunteer') filter.$or = [{ status: 'ACCEPTED' }, { volunteerId: req.user.id }];
  const [items, total] = await Promise.all([Donation.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Donation.countDocuments(filter)]);
  res.json({ success: true, data: { items, page, limit, total, pages: Math.ceil(total / limit) } });
});

router.get('/:id', async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) throw new HttpError(404, 'DONATION_NOT_FOUND', 'Donation not found.');
  if (req.user.role === 'donor' && String(donation.donorId) !== req.user.id) throw new HttpError(403, 'FORBIDDEN', 'You cannot view this donation.');
  if (req.user.role === 'ngo' && (req.user.verificationStatus !== 'VERIFIED' || (donation.status !== 'AVAILABLE' && String(donation.ngoId) !== req.user.id))) throw new HttpError(403, 'FORBIDDEN', 'Only verified NGOs can view available donations.');
  if (req.user.role === 'volunteer' && donation.status !== 'ACCEPTED' && String(donation.volunteerId) !== req.user.id) throw new HttpError(403, 'FORBIDDEN', 'You cannot view this donation.');
  res.json({ success: true, data: { donation } });
});

router.post('/:id/accept', allowRoles('ngo'), async (req, res) => {
  const user = req.user;
  if (user.verificationStatus !== 'VERIFIED') throw new HttpError(403, 'NGO_NOT_VERIFIED', 'Your NGO must be verified before accepting donations.');
  const donation = await Donation.findOneAndUpdate(
    { _id: req.params.id, status: 'AVAILABLE' },
    { $set: { status: 'ACCEPTED', ngoId: user.id, ngoName: user.organization || user.name, acceptedAt: new Date() } },
    { returnDocument: 'after', runValidators: true },
  );
  if (!donation) throw new HttpError(409, 'DONATION_NOT_AVAILABLE', 'This donation has already been accepted or is no longer available.');
  await notify({ userId: donation.donorId, role: 'donor', title: 'Donation Accepted', message: `${donation.ngoName} accepted your donation: ${donation.eventName}.`, donationId: donation.id });
  await notify({ role: 'volunteer', title: 'Pickup Assignment Open', message: `A pickup is ready for ${donation.eventName}.`, donationId: donation.id });
  res.json({ success: true, data: { donation }, message: 'Donation accepted successfully.' });
});

router.post('/:id/cancel', allowRoles('donor'), async (req, res) => {
  const donation = await Donation.findOneAndUpdate({ _id: req.params.id, donorId: req.user.id, status: 'AVAILABLE' }, { $set: { status: 'CANCELLED', cancelReason: String(req.body?.reason || 'Cancelled by donor') } }, { returnDocument: 'after' });
  if (!donation) throw new HttpError(404, 'CANCELLATION_NOT_ALLOWED', 'Donation not found or can no longer be cancelled.');
  await notify({ role: 'ngo', title: 'Donation Cancelled', message: `${donation.eventName} is no longer available.`, donationId: donation.id });
  res.json({ success: true, data: { donation }, message: 'Donation cancelled.' });
});

router.post('/:id/assign-volunteer', allowRoles('volunteer'), async (req, res) => {
  const volunteer = req.user;
  const donation = await Donation.findOneAndUpdate(
    { _id: req.params.id, status: 'ACCEPTED', volunteerId: null },
    { $set: { status: 'PICKUP_ASSIGNED', volunteerId: volunteer.id, volunteerName: volunteer.name, volunteerPhone: volunteer.phone, assignmentAcceptedAt: new Date() } },
    { returnDocument: 'after', runValidators: true },
  );
  if (!donation) throw new HttpError(409, 'ASSIGNMENT_NOT_AVAILABLE', 'This pickup has already been assigned or is no longer available.');
  await notify({ userId: donation.donorId, role: 'donor', title: 'Volunteer Assigned', message: `${volunteer.name} accepted the pickup for ${donation.eventName}.`, donationId: donation.id });
  await notify({ userId: donation.ngoId, role: 'ngo', title: 'Volunteer Assigned', message: `${volunteer.name} accepted the pickup for ${donation.eventName}.`, donationId: donation.id });
  res.json({ success: true, data: { donation }, message: 'Pickup assignment accepted.' });
});

const statusTransitions = {
  PICKUP_IN_PROGRESS: { from: 'PICKUP_ASSIGNED', timestamp: 'pickupStartedAt' },
  PICKED_UP: { from: 'PICKUP_IN_PROGRESS', timestamp: 'pickedUpAt' },
  DELIVERY_IN_PROGRESS: { from: 'PICKED_UP', timestamp: 'deliveryStartedAt' },
  DELIVERED: { from: 'DELIVERY_IN_PROGRESS', timestamp: 'deliveredAt' },
  COMPLETED: { from: 'DELIVERED', timestamp: 'completedAt' },
};

router.patch('/:id/status', allowRoles('volunteer'), async (req, res) => {
  const transition = statusTransitions[req.body?.status];
  if (!transition) throw new HttpError(400, 'INVALID_STATUS', 'The requested status is not a valid volunteer workflow step.');
  const donation = await Donation.findOneAndUpdate(
    { _id: req.params.id, volunteerId: req.user.id, status: transition.from },
    { $set: { status: req.body.status, [transition.timestamp]: new Date() } },
    { returnDocument: 'after', runValidators: true },
  );
  if (!donation) throw new HttpError(409, 'INVALID_STATUS_TRANSITION', 'This donation is not assigned to you or its status has changed. Refresh and try again.');
  const statusMessages = {
    PICKUP_IN_PROGRESS: 'Volunteer is en route to the pickup location.',
    PICKED_UP: 'Food has been picked up from the donor.',
    DELIVERY_IN_PROGRESS: 'Volunteer is delivering food to the NGO.',
    DELIVERED: 'Food has arrived safely at the NGO.',
    COMPLETED: 'Donation workflow completed.',
  };
  await Promise.all([donation.donorId, donation.ngoId].filter(Boolean).map((userId) => notify({ userId, role: userId.equals(donation.donorId) ? 'donor' : 'ngo', title: `Status Update: ${donation.eventName}`, message: statusMessages[donation.status], donationId: donation.id })));
  res.json({ success: true, data: { donation }, message: 'Donation status updated.' });
});

export default router;
