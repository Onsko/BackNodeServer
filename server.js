import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import User from "./models/userModel.js"


import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoute.js'
import userRouter from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import bcrypt from "bcryptjs";
import productRoutes from './routes/productRoutes.js';



const app= express();
const port= process.env.PORT || 4000 
connectDB();

const allowedOrigins= ['http://localhost:5173']


const createAdminUser = async () => {
  const adminExists = await User.findOne({ email: "admin1@example.com" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "OnskAdmin",
      email: "admin1@example.com",
      password: "$2a$12$uaDZE4aovb7Ery5INdI9R.w9bAzSnS0HlBsK1FRfehLgMMwwcJujS",
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
app.use(cors({ origin:allowedOrigins, credentials: true }));


// API endpoints
app.get('/',(req,res)=> res.send("API working !!"));
app.use('/api/auth', authRouter) // pour l'auth
app.use('/api/user', userRouter) // pour les data du user
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);


app.listen(port, ()=> console.log(`Server started on PORT:${port}`));