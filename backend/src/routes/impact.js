import { Router } from 'express';
import Donation from '../models/Donation.js';
import User from '../models/User.js';

const router = Router();

router.get('/', async (req, res) => {
  const [completed, eventsConnected, partnerNgos, activeVolunteers] = await Promise.all([
    Donation.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, mealsServed: { $sum: '$estimatedMeals' }, completedDeliveries: { $sum: 1 } } },
    ]),
    Donation.countDocuments({ status: { $in: ['ACCEPTED', 'PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'] } }),
    User.countDocuments({ role: 'ngo', status: 'ACTIVE', verificationStatus: 'VERIFIED' }),
    User.countDocuments({ role: 'volunteer', status: 'ACTIVE' }),
  ]);
  res.json({
    success: true,
    data: {
      mealsServed: completed[0]?.mealsServed || 0,
      completedDeliveries: completed[0]?.completedDeliveries || 0,
      eventsConnected,
      partnerNgos,
      activeVolunteers,
    },
  });
});

export default router;
