import Notification from '../models/Notification.js';

export async function notify({ userId = null, role, title, message, donationId }) {
  try {
    return await Notification.create({ userId, role, title, message, donationId });
  } catch (error) {
    console.error('Could not save workflow notification:', error.message);
    return null;
  }
}
