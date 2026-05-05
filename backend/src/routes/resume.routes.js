import { Router } from "express";
import multer from "multer";
import { getLatestResume, uploadResume } from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF and DOCX resume files are allowed"));
    }
    cb(null, true);
  }
});

const handleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (!error) return next();

    const statusCode = error instanceof multer.MulterError ? 400 : 415;
    res.status(statusCode).json({ message: error.message });
  });
};

router.post("/upload", protect, handleUpload, uploadResume);
router.get("/latest", protect, getLatestResume);

export default router;
