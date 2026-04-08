import multer from "multer";
import path from "path"
const {
  FILE_SIZE_LIMIT,
  ALLOWED_FILE_TYPES,
} = require("../constants/appConstants");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = ALLOWED_FILE_TYPES.map((type) => type.mime);

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.map((t) => t.ext).join(", ")}`,
      ),
      false,
    );
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter: fileFilter,
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({
        success: false,
        error: `File too large. Maximum size: ${FILE_SIZE_LIMIT / (1024 * 1024)}MB`,
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next(err);
};

export const  = {
  single: (fieldName) => [upload.single(fieldName), handleMulterError],
  array: (fieldName, maxCount) => [
    upload.array(fieldName, maxCount),
    handleMulterError,
  ],
};
