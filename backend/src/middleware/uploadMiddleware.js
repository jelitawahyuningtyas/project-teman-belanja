import multer from "multer";
import path from "path";
import fs from "fs";

// =========================
// UPLOAD DIRECTORY
// =========================

const uploadDirectory = path.join(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =========================
// STORAGE
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `product-${Date.now()}${extension}`;

    cb(null, filename);
  },
});

// =========================
// FILE FILTER
// =========================

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }

  cb(
    new Error("File harus berupa gambar."),
    false
  );
};

// =========================
// MULTER
// =========================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =========================
// EXPORT
// =========================

export default upload;