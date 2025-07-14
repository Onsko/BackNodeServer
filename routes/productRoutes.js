import express from 'express';
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

export default router;
