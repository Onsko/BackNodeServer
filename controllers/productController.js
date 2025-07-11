import Product from '../models/Product.js';

// ✅ Créer un produit
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Lister tous les produits
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
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
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    product.visibility = !product.visibility;
    await product.save();
    res.json({ success: true, visibility: product.visibility });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
