// controllers/categoryController.js
import Category from '../models/category.js';
import fs from 'fs';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Erreur getAllCategories:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image requise' });
    }

    // Vérifie si la catégorie existe déjà
    const existingCat = await Category.findOne({ name });
    if (existingCat) {
      // Supprime le fichier uploadé car doublon
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Cette catégorie existe déjà' });
    }

    const newCategory = new Category({
      name,
      imageUrl: req.file.filename,
    });

    await newCategory.save();
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Erreur createCategory:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
