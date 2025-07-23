import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/userModel.js";
import connectDB from './config/mongodb.js';

// 🔹 Importation des routes
import authRouter from './routes/authRoute.js';
import userRouter from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homeRoutes from './routes/temp.js'; // Produits + catégories visibles pour client
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js'; // ✅ ta route promotion ici

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = ['http://localhost:5173'];

const createAdminUser = async () => {
  const adminExists = await User.findOne({ email: "admin1@example.com" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "OnskAdmin",
      email: "admin1@example.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Admin créé !");
  } else {
    console.log("ℹ️ Admin déjà existant.");
  }
};

createAdminUser();

// 🔹 Middleware globaux
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// 🔹 Routes
app.get('/', (req, res) => res.send("🟢 API en ligne !"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes); // ✅ La route de promotions ici

// 🔹 Fichiers statiques (images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/category-images", express.static(path.join(__dirname, "uploads/category-images")));

// ✅ Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${port}`);
});
