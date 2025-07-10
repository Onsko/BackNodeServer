import express from 'express';
import { getAllUsers, toggleBlockUser } from '../controllers/adminController.js';
import { userAuth } from '../middlewares/userAuth.js';

const router = express.Router();

router.get('/users', userAuth, getAllUsers); // Protection selon ton besoin
router.put('/users/block/:id', userAuth, toggleBlockUser);

export default router;
