import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountAmount: { type: Number, required: true },
  isPercentage: { type: Boolean, default: false },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // ✅ Enregistrer les utilisateurs qui ont utilisé ce code
});

export default mongoose.model('PromoCode', promoCodeSchema);