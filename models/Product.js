import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  category: String,
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  imageUrl: String,
  isVisible: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
