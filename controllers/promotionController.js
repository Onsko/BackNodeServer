import Promotion from '../models/Promotion.js';
import Product from '../models/Product.js';
//promotionController.js
// ✅ Créer une promotion
export const createPromotion = async (req, res) => {
  try {
    const { name, discountType, discountValue, targetProduct, startDate, endDate } = req.body;

    const product = await Product.findById(targetProduct);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });

    const originalPrice = product.originalPrice || product.price;

    let newPrice = originalPrice;
    if (discountType === 'percentage') {
      newPrice = originalPrice * (1 - discountValue / 100);
    } else if (discountType === 'fixed') {
      newPrice = originalPrice - discountValue;
    }
    if (newPrice < 0) newPrice = 0;

    const promotion = new Promotion({
      name,
      discountType,
      discountValue,
      targetProduct,
      startDate,
      endDate,
      isActive: true,
    });
    await promotion.save();

    await Product.findByIdAndUpdate(targetProduct, {
      originalPrice,
      price: Math.round(newPrice * 100) / 100,
      isOnPromotion: true,
    });

    res.status(201).json({ success: true, promotion });
  } catch (err) {
    console.error("Erreur création promotion :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Activer/désactiver
export const togglePromotionStatus = async (req, res) => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promotion non trouvée" });

    promo.isActive = !promo.isActive;
    await promo.save();

    const product = await Product.findById(promo.targetProduct);
    if (!product) return res.status(404).json({ message: "Produit lié non trouvé" });

    if (!product.originalPrice) product.originalPrice = product.price;

    if (promo.isActive) {
      let newPrice = product.originalPrice;
      if (promo.discountType === 'percentage') {
        newPrice = newPrice * (1 - promo.discountValue / 100);
      } else if (promo.discountType === 'fixed') {
        newPrice = newPrice - promo.discountValue;
      }
      if (newPrice < 0) newPrice = 0;
      product.price = Math.round(newPrice * 100) / 100;
      product.isOnPromotion = true;
    } else {
      product.price = product.originalPrice;
      product.isOnPromotion = false;
    }

    await product.save();
    res.status(200).json({ success: true, promo, updatedProduct: product });
  } catch (err) {
    console.error("Erreur toggle promotion :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Supprimer une promotion
export const deletePromotion = async (req, res) => {
  try {
    const promo = await Promotion.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promotion non trouvée" });

    await Product.findByIdAndUpdate(promo.targetProduct, {
      isOnPromotion: false,
      price: undefined,
      originalPrice: undefined,
    });

    res.status(200).json({ success: true, message: "Promotion supprimée." });
  } catch (err) {
    console.error("Erreur suppression promotion :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Liste promotions
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('targetProduct');
    res.status(200).json({ success: true, promotions });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
