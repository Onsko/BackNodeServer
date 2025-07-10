import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: '' },
  resetOtpExpireAt: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },  // <-- AJOUT DU ROLE ICI
    isBlocked: { type: Boolean, default: false }, // ✅ ajouté

});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
