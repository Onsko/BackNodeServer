import multer from "multer";
import path from "path";

// Dossier où seront stockées les images (chemin absolu)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("uploads")); // "uploads" à la racine du projet backend
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtrage pour accepter uniquement certains types d’images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non supporté. Seules les images sont acceptées."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo max
  },
});
