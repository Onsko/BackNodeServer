import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Route pour récupérer catégories distinctes uniquement sur produits visibles (côté client)
router.get('/distinct-categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isVisible: true });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Route pour récupérer produits visibles paginés (côté client)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const filter = { isVisible: true };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name');

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
