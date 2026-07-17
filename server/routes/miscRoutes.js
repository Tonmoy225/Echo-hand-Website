import express from "express";
import { submitReport, submitFeedback } from "../controllers/miscController.js";
import { deleteComment } from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/reports", protect, submitReport);
router.post("/feedback", protect, submitFeedback);
router.delete("/comments/:id", protect, deleteComment);

export default router;
