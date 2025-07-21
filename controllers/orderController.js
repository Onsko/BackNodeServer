import transporter from '../config/nodemailer.js';
import Order from '../models/Order.js';
import User from '../models/userModel.js';
import Product from '../models/Product.js';

// 🟢 Création de commande
export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user._id;

    let totalAmount = 0;

    for (const item of products) {
      const prod = await Product.findById(item.productId);
      if (!prod) {
        return res.status(404).json({ success: false, message: `Produit avec ID ${item.productId} introuvable.` });
      }

      if (prod.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Produit "${prod.name}" en rupture de stock. Stock disponible : ${prod.stock}`,
        });
      }

      totalAmount += prod.price * item.quantity;
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
  try {
    const orders = await Order.find({ status: { $ne: 'Annulée' } })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
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
    if (user) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: `Mise à jour de votre commande ${order._id}`,
        text: `Bonjour,\n\nLe statut de votre commande ${order._id} a été mis à jour : ${status}.\n\nMerci pour votre confiance.`,
      };
      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, order });

  } catch (err) {
    console.error("Erreur mise à jour statut + mail", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟢 Annulation commande par le client

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    // Trouver la commande et vérifier qu'elle appartient à l'utilisateur
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable ou non autorisée" });
    }

    // Modifier le statut en 'Annulée' (ou supprimer si tu veux la supprimer totalement)
    order.status = 'Annulée';
    await order.save();

    res.json({ success: true, message: "Commande annulée", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

