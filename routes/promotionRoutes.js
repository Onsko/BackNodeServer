import express from 'express';
import {
  createPromotion,
  getPromotions,
  togglePromotionStatus,
  deletePromotion
} from '../controllers/promotionController.js';

const router = express.Router();

router.post('/', createPromotion);
router.get('/', getPromotions);
router.patch('/:id/toggle', togglePromotionStatus);
router.delete('/:id', deletePromotion);

export default router;
