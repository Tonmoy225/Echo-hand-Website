import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const streamUpload = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

// @route   POST /api/upload
// @desc    Upload a single image (avatar, cover, post image)
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const result = await streamUpload(req.file.buffer, "ecohand");
    res.json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload up to 6 images (for post listings)
// @access  Private
router.post("/multiple", protect, upload.array("images", 6), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const uploads = await Promise.all(
      req.files.map((file) => streamUpload(file.buffer, "ecohand/posts"))
    );
    res.json({ urls: uploads.map((u) => u.secure_url) });
  } catch (error) {
    next(error);
  }
});

export default router;
