import express from 'express';
import { getAllOrders, updateOrderStatus, createOrder, getUserOrders } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Route accessible uniquement par un admin connecté
router.get('/all', userAuth, isAdmin, getAllOrders);
router.put('/update-status', userAuth, isAdmin, updateOrderStatus);

// Routes accessibles par un user connecté
router.post('/', userAuth, createOrder);
router.get('/user', userAuth, getUserOrders);

export default router;
