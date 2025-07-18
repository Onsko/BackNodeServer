// backend/controllers/orderController.js
import transporter from '../config/nodemailer.js';
import Order from '../models/Order.js';  // adapte selon ton modèle
import User from '../models/userModel.js';    // adapte selon ton modèle

export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = req.user._id;
console.log(req.body)
    // Récupérer l'utilisateur complet pour avoir son email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const order = new Order({ userId, products, totalAmount });
    await order.save();

    // Préparation du mail
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Commande reçue',
      text: `Votre commande ${order._id} est en attente de confirmation.`
    };

    // Ajoute ces deux lignes pour debug :
    console.log('Email utilisateur:', user.email);
    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getAllOrders = async (req, res) => {
  console.log("GET /api/orders/all appelée");
  try {
    const orders = await Order.find().populate('userId', 'email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }

  
};
