import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['donor', 'ngo', 'volunteer', 'admin'], required: true },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  organization: { type: String, trim: true, maxlength: 150, default: '' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
}, { timestamps: true, versionKey: false });

export default mongoose.model('User', userSchema);
