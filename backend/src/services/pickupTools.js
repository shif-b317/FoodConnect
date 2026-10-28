import mongoose from 'mongoose';
import Donation from '../models/Donation.js';

export async function getPickupStatus(pickupId) {
  try {
    if (!mongoose.isValidObjectId(pickupId)) {
      return { error: 'Invalid pickup ID' };
    }

    const pickup = await Donation.findById(pickupId)
      .select('_id status pickupWindow')
      .lean();

    return pickup || { error: 'Pickup not found' };
  } catch {
    return { error: 'Invalid pickup ID' };
  }
}
