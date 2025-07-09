import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password'); // exclut le password

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role   // ✅ ICI on renvoie le rôle
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

