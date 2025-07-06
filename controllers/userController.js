import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // 🔁 On récupère userId injecté par le middleware userAuth
    const userId = req.userId;

    // 🔍 Vérifier si l'utilisateur existe
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // ✅ Retourner les données utilisateur
    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
        email: user.email, // optionnel
      },
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
