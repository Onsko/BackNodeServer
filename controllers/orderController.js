import transporter from '../config/nodemailer.js';
import Order from '../models/Order.js';
import User from '../models/userModel.js';
import Product from '../models/Product.js'; // ✅ à ajouter absolument

// 🟢 Création de commande
export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = req.user._id;

    // Vérification de stock avant création
    for (const item of products) {
      const prod = await Product.findById(item.productId);
      if (!prod || prod.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Produit "${item.name}" en rupture de stock.` });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const order = new Order({ userId, products, totalAmount });
    await order.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Commande reçue',
      text: `Votre commande ${order._id} est en attente de confirmation.`
    };

    console.log('Email utilisateur:', user.email);
    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Erreur création commande:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟢 Commandes de l'utilisateur connecté
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟢 Toutes les commandes (admin)
export const getAllOrders = async (req, res) => {
  console.log("GET /api/orders/all appelée");
  try {
    const orders = await Order.find().populate('userId', 'email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟢 Mise à jour du statut (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }

    // ⚠️ Gérer stock si commande confirmée
    if (status === 'Confirmée') {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Stock insuffisant pour ${product.name}` });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

    order.status = status;
    await order.save();

    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Mise à jour de votre commande ${order._id}`,
      text: `Bonjour,\n\nLe statut de votre commande ${order._id} a été mis à jour : ${status}.\n\nMerci pour votre confiance.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, order });

  } catch (err) {
    console.error("Erreur mise à jour statut + mail", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
