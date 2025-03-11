import multer from "multer";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Ensure the destination directory is 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, `${req.headers.phone}-${Date.now()}.jpg`); // Always use .jpg extension
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Not a valid upload. Only JPG images are allowed."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadImage = upload.single('photo'); // Accept only single image file with field name 'photo'
