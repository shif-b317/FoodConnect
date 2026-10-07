import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  role: { type: String, enum: ['donor', 'ngo', 'volunteer', 'admin', 'all'], required: true, index: true },
  title: { type: String, required: true, maxlength: 160 },
  message: { type: String, required: true, maxlength: 1000 },
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', default: null },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: { createdAt: 'timestamp', updatedAt: false }, versionKey: false });

notificationSchema.index({ role: 1, timestamp: -1 });

export default mongoose.model('Notification', notificationSchema);
