import Category from '../models/category.js';
import path from 'path';
import fs from 'fs';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image requise' });
    }

    // Vérifie si catégorie existe déjà
    const existingCat = await Category.findOne({ name });
    if (existingCat) {
      // Supprime le fichier uploadé car doublon
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Cette catégorie existe déjà' });
    }

    const newCategory = new Category({
      name,
      imageUrl: req.file.filename,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
