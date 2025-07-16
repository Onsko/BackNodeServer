// models/category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true }, // stocke juste le nom du fichier
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
