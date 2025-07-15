import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import User from "./models/userModel.js";

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoute.js';
import userRouter from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homeRoutes from './routes/temp.js'; // ⚠️ Route utilisée pour les catégories distinctes

import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

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
      password: "$2a$12$uaDZE4aovb7Ery5INdI9R.w9bAzSnS0HlBsK1FRfehLgMMwwcJujS", // hash déjà existant
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

// ✅ Routes API principales
app.get('/', (req, res) => res.send("API working !!"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// ✅ Route pour les catégories distinctes
app.use('/api', homeRoutes); // <-- contient /product/distinct-categories

// ✅ Sert les images produits (Multer)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Sert les images catégories (public/category-images)
app.use("/category-images", express.static(path.join(__dirname, "public/category-images")));

app.listen(port, () => console.log(`✅ Server started on PORT: ${port}`));
