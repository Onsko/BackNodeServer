import express from 'express';
import multer from 'multer';
import path from 'path';

import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/category-images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', categoryController.getAllCategories);
router.post('/', upload.single('image'), categoryController.createCategory);

// Route pour modifier la catégorie (image optionnelle)
router.put('/:id', upload.single('image'), categoryController.updateCategory);

// Route pour supprimer la catégorie
router.delete('/:id', categoryController.deleteCategory);

export default router;
