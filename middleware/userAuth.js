import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // 🔐 Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    // ✅ Injecter l'ID de l'utilisateur dans la requête
    req.userId = decoded.id;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. ' + error.message,
    });
  }
};

export default userAuth;
