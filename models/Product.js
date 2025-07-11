import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String, // URL ou base64
    price: { type: Number, required: true },
    category: String,
    visibility: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
