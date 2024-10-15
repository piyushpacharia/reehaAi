import cryptoRandomString from "crypto-random-string";
import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPaths = {
      profilePic: 'uploads/profilePic',
      video: 'uploads/video',
      audio: 'uploads/audioFile',
    };

    // Use the upload path from `fileCategory` if not predefined in `uploadPaths`
    const uploadPath = uploadPaths[file.fieldname] || path.join('uploads', req.params.fileCategory);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = cryptoRandomString({ length: 10, type: 'alphanumeric' });
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File type filter
const fileExtensionFilter = (req, file, cb) => {
  const allowedMimetypes = [
    "video/mp4", "audio/mpeg",
    "image/png", "image/jpeg", "image/jpg", "image/webp"
  ];

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4, MP3, PNG, JPG, JPEG, and WebP files are allowed!"));
  }
};

// Multer setup
const imgUpload = multer({
  storage,
  fileFilter: fileExtensionFilter,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1MB file size limit for demonstration
}).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
]);

// Error handling middleware for file uploads
export const uploadFile = (req, res, next) => {
  imgUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload (e.g., file too large)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File too large. Max allowed size is 1MB." });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: "Unexpected file field. Please check the field names." });
      }
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred (e.g., invalid file type)
      return res.status(400).json({ error: err.message });
    }
    
    // If no errors, continue to next middleware
    next();
  });
};
