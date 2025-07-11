// controllers/userController.js

import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // ✅ Corrigé : récupérer user depuis req.user injecté par le middleware userAuth
    const user = req.user;

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // ✅ Retourner les données utilisateur
    res.json({
      success: true,
      userData: {
        id: user._id,
        name: user.name,
        isAccountVerified: user.isAccountVerified,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
