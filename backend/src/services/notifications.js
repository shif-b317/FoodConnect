import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail } from './email.js';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export async function notify({ userId = null, role, title, message, donationId }) {
  try {
    const notification = await Notification.create({ userId, role, title, message, donationId });
    if (userId) {
      const recipient = await User.findById(userId).select('email status notificationPreferences');
      if (recipient?.status === 'ACTIVE' && recipient.notificationPreferences?.email !== false) {
        void sendEmail({
          to: recipient.email,
          subject: `FOOD CONNECT: ${title}`,
          text: message,
          html: `<p>${escapeHtml(message)}</p>`,
        }).catch((error) => console.error('Could not send notification email:', error.message));
      }
    }
    return notification;
  } catch (error) {
    console.error('Could not save workflow notification:', error.message);
    return null;
  }
}
