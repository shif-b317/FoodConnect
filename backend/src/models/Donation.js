import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  donorName: { type: String, required: true, trim: true },
  donorPhone: { type: String, default: '' },
  eventName: { type: String, required: true, trim: true, maxlength: 150 },
  eventType: { type: String, required: true, trim: true, maxlength: 80 },
  foodType: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, default: '', maxlength: 2000 },
  quantity: { type: String, required: true, trim: true, maxlength: 100 },
  estimatedMeals: { type: Number, required: true, min: 1 },
  preparationTime: { type: String, default: '' },
  pickupLocation: {
    address: { type: String, required: true }, city: { type: String, required: true },
    postalCode: { type: String, default: '' }, coordinates: { type: [Number], default: [] },
  },
  pickupWindow: { from: String, to: String, date: String },
  foodSafetyInfo: { temperatureMaintained: String, containerType: String, allergens: String },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['AVAILABLE', 'ACCEPTED', 'PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED', 'CANCELLED'], default: 'AVAILABLE', index: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  ngoName: { type: String, default: null },
  acceptedAt: Date,
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  volunteerName: { type: String, default: null },
  volunteerPhone: { type: String, default: '' },
  assignmentAcceptedAt: Date,
  pickupStartedAt: Date,
  pickedUpAt: Date,
  deliveryStartedAt: Date,
  deliveredAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String,
}, { timestamps: true, versionKey: false });

donationSchema.index({ status: 1, 'pickupLocation.city': 1, createdAt: -1 });

export default mongoose.model('Donation', donationSchema);
