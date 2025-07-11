import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Accès non autorisé : token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Token invalide" });
    }

    // Récupérer l'utilisateur complet dans la DB
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    req.user = user;  // Stocke l'objet utilisateur complet
    next();
  } catch (error) {
    res.status(401).json({ message: "Token expiré ou invalide", error: error.message });
  }
};

export default userAuth;
