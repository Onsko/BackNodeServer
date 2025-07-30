import PromoCode from '../models/PromoCode.js';

// ✅ Créer un nouveau code promo
export const createPromoCode = async (req, res) => {
  try {
    const { code, discountAmount, isPercentage, validFrom, validUntil, isActive } = req.body;
    const newPromo = new PromoCode({ code, discountAmount, isPercentage, validFrom, validUntil, isActive });
    await newPromo.save();
    res.status(201).json(newPromo);
  } catch (err) {
    res.status(500).json({ message: "Erreur création code promo", error: err.message });
  }
};

// ✅ Récupérer tous les codes promo
export const getPromoCodes = async (req, res) => {
  try {
    const promos = await PromoCode.find().populate('usedBy', 'name email').sort({ validUntil: -1 });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération codes promo", error: err.message });
  }
};

// ✅ Valider un code promo côté client (avec userAuth obligatoire)
export const validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;
    const now = new Date();

    const promo = await PromoCode.findOne({ code });

    if (!promo || !promo.isActive) {
      return res.status(400).json({ error: 'Code invalide ou inactif' });
    }

    if (now < promo.validFrom || now > promo.validUntil) {
      return res.status(400).json({ error: 'Code expiré ou non encore actif' });
    }

    if (promo.usedBy.includes(userId)) {
      return res.status(400).json({ error: 'Vous avez déjà utilisé ce code promo.' });
    }

    promo.usedBy.push(userId);
    await promo.save();

    res.json(promo);
  } catch (err) {
    res.status(500).json({ message: 'Erreur validation code promo', error: err.message });
  }
};

// ✅ Activer/désactiver un code promo
export const togglePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Code promo non trouvé' });

    promo.isActive = !promo.isActive;
    await promo.save();

    res.json(promo);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du changement de statut', error: err.message });
  }
};

// ✅ Supprimer un code promo
export const deletePromoCode = async (req, res) => {
  try {
    const deleted = await PromoCode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Code promo non trouvé' });

    res.json({ message: 'Code promo supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
};