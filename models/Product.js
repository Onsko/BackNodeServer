import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },           // Prix actuel (avec promo si active)
  originalPrice: { type: Number },                   // Prix avant promo
  isOnPromotion: { type: Boolean, default: false },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: { type: Number, default: 0, min: 0 },
  imageUrl: String,
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
