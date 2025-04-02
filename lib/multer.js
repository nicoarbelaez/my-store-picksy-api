import multer from 'multer';
import path from 'path';

// Solo se usa para guardar imágenes en local. Cambiar multer.memoryStorage() por storage.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // fileFilter: (req, file, cb) => {
  //   if (allowedMimeTypes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //     return cb(new Error(`Only ${allowedMimeTypes.join(', ')}`));
  //   }
  // },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

export const upload = multer({
  storage: multer.memoryStorage(),
});
