import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  EditProduct,
  deleteProduct,
  toggleVisibility,
  getAllProductsAdmin  // 👈 importe ici
} from '../controllers/productController.js';

import { upload } from '../middleware/upload.js';

const router = express.Router();

// ROUTES
router.get('/', getAllProducts); // Pour client : produits visibles uniquement
router.get('/admin/all', getAllProductsAdmin); // 👈 Pour admin : tous produits (masqués inclus)
router.get('/:id', getProductById);
router.put('/:id', upload.single('image'), EditProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/visibility', toggleVisibility);
router.post('/', upload.single('image'), createProduct);

// Catégories distinctes (sans filtre isVisible)
router.get('/distinct-categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
