import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['donor', 'ngo', 'volunteer', 'admin'], required: true },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  organization: { type: String, trim: true, maxlength: 150, default: '' },
  registrationNumber: { type: String, trim: true, maxlength: 80, default: '' },
  verificationEvidenceUrl: { type: String, trim: true, maxlength: 2048, default: '' },
  verificationStatus: { type: String, enum: ['NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED'], default() { return this.role === 'ngo' ? 'PENDING' : 'NOT_REQUIRED'; } },
  verificationNote: { type: String, trim: true, maxlength: 1000, default: '' },
  verificationReviewedAt: Date,
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpiresAt: { type: Date, select: false },
  passwordChangedAt: Date,
  tokenVersion: { type: Number, default: 0 },
  notificationPreferences: {
    email: { type: Boolean, default: true },
  },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
}, { timestamps: true, versionKey: false });

export default mongoose.model('User', userSchema);
