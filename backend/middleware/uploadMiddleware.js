const multer = require("multer");

// Store uploaded image temporarily in memory
const storage = multer.memoryStorage();

// Allowed image types
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Multer configuration
const upload = multer({
  storage: storage,

  // Maximum file size = 5 MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  // Check file type
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        ),
        false
      );
    }
  },
});

module.exports = upload;