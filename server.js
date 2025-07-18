import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/userModel.js";
import connectDB from './config/mongodb.js';

import authRouter from './routes/authRoute.js';
import userRouter from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homeRoutes from './routes/temp.js'; // Route client (produits visibles, catégories visibles)
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


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
    console.log("Admin created!");
  } else {
    console.log("Admin already exists.");
  }
};

createAdminUser();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes principales
app.get('/', (req, res) => res.send("API working !!"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);  // <-- ici la route avec /admin/all
app.use('/api/home', homeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);


// Serveur static pour les images produits
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Serveur static pour les images catégories
app.use("/category-images", express.static(path.join(__dirname, "uploads/category-images")));

app.listen(port, () => console.log(`✅ Server started on PORT: ${port}`));
