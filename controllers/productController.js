import Product from '../models/Product.js';
import fs from "fs";
import path from "path";


// ✅ Créer un produit
// controllers/productController.js

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
      imageUrl: `/${req.file.filename}`, // ✅ URL utilisable dans le navigateur
    });

    await product.save();

    res.status(201).json({ message: "Produit créé avec succès", product });
  } catch (error) {
    console.error("🔥 ERREUR dans createProduct :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};





// ✅ Lister tous les produits
export const getAllProducts = async (req, res) => {
  try {
    console.log('--------------------------------------')
    const products = await Product.find().populate('category','name');
    console.log({products})
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Obtenir un produit par ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit non trouvé." });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ success: false, message: "Requête invalide." });
  }
};

// ✅ Modifier un produit
export const EditProduct = async (req, res) => {
  try {
    console.log("Requête reçue : body =", req.body);
    console.log("Requête reçue : fichier =", req.file);

    const productId = req.params.id;
    const { name, price, description, category, stock } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

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
        const oldImagePath = path.join(process.cwd(), product.imageUrl);
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


// ✅ Supprimer un produit
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Changer la visibilité
export const toggleVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit non trouvé." });
    }
    product.isVisible = !product.isVisible;  // toggle isVisible
    await product.save();
    res.json({ success: true, isVisible: product.isVisible });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
