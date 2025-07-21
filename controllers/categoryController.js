import Category from '../models/category.js';
import path from 'path';
import fs from 'fs';

// Liste toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Crée une nouvelle catégorie
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image requise' });
    }

    const existingCat = await Category.findOne({ name });
    if (existingCat) {
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
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprime une catégorie par son ID
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    // Supprimer le fichier image
    const imagePath = path.join('uploads/category-images', category.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await category.deleteOne();

    res.json({ success: true, message: 'Catégorie supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier une catégorie (nom + image optionnelle)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let updatedData = { name };

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    // Si une nouvelle image est uploadée, supprimer l'ancienne et mettre à jour
    if (req.file) {
      const oldImagePath = path.join('uploads/category-images', category.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updatedData.imageUrl = req.file.filename;
    }

    // Vérifier que le nouveau nom n'existe pas déjà (différent de cette catégorie)
    const existingCat = await Category.findOne({ name });
    if (existingCat && existingCat._id.toString() !== id) {
      // Supprimer le fichier uploadé si nouvelle image (car nom déjà utilisé)
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Une autre catégorie porte déjà ce nom' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, { new: true });

    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
