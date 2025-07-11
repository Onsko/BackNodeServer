import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleVisibility,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById); // ✅ Ajouté
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/visibility', toggleVisibility);

export default router;
