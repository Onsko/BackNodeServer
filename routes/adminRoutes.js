import express from 'express';
import { getAllUsers, toggleBlockUser } from '../controllers/adminController.js';
import userAuth from '../middleware/userAuth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/users', userAuth, isAdmin, getAllUsers);
router.put('/users/block/:id', userAuth, isAdmin, toggleBlockUser); // corrigé toggleBlockUser

export default router;
