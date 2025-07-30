import express from 'express';
import {
  createPromoCode,
  getPromoCodes,
  validatePromoCode,
  togglePromoCode,
  deletePromoCode
} from '../controllers/promoCodeController.js';
import userAuth from '../middleware/userAuth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/', userAuth, isAdmin, createPromoCode);
router.get('/', userAuth, isAdmin, getPromoCodes);
router.post('/validate', userAuth, validatePromoCode);
router.patch('/toggle/:id', userAuth, isAdmin, togglePromoCode);
router.delete('/:id', userAuth, isAdmin, deletePromoCode);

export default router;