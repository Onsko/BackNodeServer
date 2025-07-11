import userModel from '../models/userModel.js';

// GET /api/admin/users?page=1&limit=5
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    console.log({search})
      const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },    // recherche insensible sur name
            { email: { $regex: search, $options: 'i' } },   // recherche insensible sur email
           
          ],
        }
      : {};

    const totalUsers = await userModel.countDocuments(filter);

    const users = await userModel
      .find(filter)
    
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // tri du plus récent au plus ancien

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur : ' + error.message });
  }
};

// PUT /api/admin/users/block/:id
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user)
      return res.status(404).json({ success: false, message: "Utilisateur introuvable." });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Utilisateur ${user.isBlocked ? 'bloqué' : 'débloqué'} avec succès`,
    });
  } catch (error) {
    console.error('Error toggling user block:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur : ' + error.message });
  }
};
