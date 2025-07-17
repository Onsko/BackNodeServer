import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;

    if (!name || !price || !req.file) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      imageUrl: `/${req.file.filename}`,
    });

    await product.save();

    res.status(201).json({ message: "Produit créé avec succès", product });
  } catch (error) {
    console.error("🔥 ERREUR dans createProduct :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

// GET all products, with pagination and admin/public distinction
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Distinction admin/public selon query param 'admin'
    const isAdmin = req.query.admin === 'true';

    let filter = {};
    if (!isAdmin) {
      // Pour public, filtre visible uniquement
      filter = { isVisible: true };
    }

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name');

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Produit non trouvé." });

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ success: false, message: "Requête invalide." });
  }
};

export const EditProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description, category, stock } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    if (!name || !price) {
      return res.status(400).json({ message: "Les champs nom et prix sont obligatoires." });
    }

    product.name = name;
    product.price = price;
    product.description = description || product.description;
    product.category = category || product.category;

    if (stock !== undefined && stock !== null) {
      const stockNumber = Number(stock);
      if (isNaN(stockNumber) || stockNumber < 0) {
        return res.status(400).json({ message: "Le stock doit être un nombre positif valide." });
      }
      product.stock = stockNumber;
    }

    if (req.file) {
      if (product.imageUrl && product.imageUrl !== "/default.jpg") {
        const oldImagePath = path.join(process.cwd(), 'uploads', product.imageUrl.replace('/', ''));
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Erreur suppression ancienne image:", err);
        });
      }
      product.imageUrl = `/${req.file.filename}`;
    }

    await product.save();

    res.status(200).json({ message: "Produit modifié avec succès", product });
  } catch (error) {
    console.error("🔥 ERREUR dans EditProduct :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Produit non trouvé." });

    product.isVisible = !product.isVisible;
    await product.save();

    res.json({ success: true, isVisible: product.isVisible });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Nouvelle fonction pour route admin /admin/all ---
// En plus de l’existant
export const getAllProductsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(); // sans filtre
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate('category', 'name');

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

