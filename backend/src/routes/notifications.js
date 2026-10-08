import { Router } from 'express';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';
import { HttpError } from '../utils/errors.js';

const router = Router();
router.use(authenticate);

const view = (notification, userId) => ({
  id: notification.id,
  userId: notification.userId?.toString() || null,
  role: notification.role,
  title: notification.title,
  message: notification.message,
  donationId: notification.donationId?.toString() || null,
  timestamp: notification.timestamp,
  read: notification.readBy.some((id) => id.toString() === userId),
});

router.get('/', async (req, res) => {
  const items = await Notification.find({ $or: [{ userId: req.user.id }, { userId: null, role: { $in: [req.user.role, 'all'] } }] }).sort({ timestamp: -1 }).limit(100);
  res.json({ success: true, data: { items: items.map((item) => view(item, req.user.id)) } });
});

router.patch('/read-all', async (req, res) => {
  await Notification.updateMany({ $or: [{ userId: req.user.id }, { userId: null, role: { $in: [req.user.role, 'all'] } }] }, { $addToSet: { readBy: req.user._id } });
  res.json({ success: true, message: 'Notifications marked as read.' });
});

router.patch('/:id/read', async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, $or: [{ userId: req.user.id }, { userId: null, role: { $in: [req.user.role, 'all'] } }] },
    { $addToSet: { readBy: req.user._id } }, { returnDocument: 'after' },
  );
  if (!notification) throw new HttpError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found.');
  res.json({ success: true, data: { notification: view(notification, req.user.id) } });
});

export default router;
