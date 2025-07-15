import express from 'express';
import Product from '../models/Product.js';

import {
  createProduct,
  getAllProducts,
  getProductById,
  EditProduct,
  deleteProduct,
  toggleVisibility
} from '../controllers/productController.js';
import { upload } from '../middleware/upload.js'; // doit être bien configuré

const router = express.Router();

// 📌 Liste des routes :
router.get('/', getAllProducts);                     // GET tous les produits
router.get('/:id', getProductById);                  // GET un produit par ID
router.put('/:id', upload.single('image'), EditProduct); // PUT avec image si modif
router.delete('/:id', deleteProduct);                // DELETE un produit
router.patch('/:id/visibility', toggleVisibility);   // PATCH pour (dés)activer
router.post('/', upload.single('image'), createProduct);   // ✅ POST produit + image


// ⚠️ Nouvelle route qui retourne les noms uniques de catégories
router.get('/distinct-categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//app.use('/api/product', productRoutes); // ou similaire



export default router;
