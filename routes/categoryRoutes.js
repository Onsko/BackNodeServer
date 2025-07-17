// routes/categoryRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Config Multer pour stocker dans /uploads/category-images
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

// Importe ton controller (en ESModule aussi)
// suppose que categoryController.js est aussi converti en ESModule avec export par défaut
import * as categoryController from '../controllers/categoryController.js';

router.get('/', categoryController.getAllCategories);
router.post('/', upload.single('image'), categoryController.createCategory);

export default router;
