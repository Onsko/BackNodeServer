// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  verifyOtp: {
    type: String,
    default: '',
  },

  verifyOtpExpireAt: {
    type: Number, // timestamp en ms, tu peux aussi utiliser Date si tu préfères
    default: 0,
  },

  isAccountVerified: {
    type: Boolean,
    default: false,
  },

  resetOtp: {
    type: String,
    default: '',
  },

  resetOtpExpireAt: {
    type: Number,
    default: 0,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  // Exemple pour le panier : tableau d'objets avec _id (référence produit), quantity, etc.
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    }
  ],

}, { timestamps: true });

export default mongoose.model('User', userSchema);
