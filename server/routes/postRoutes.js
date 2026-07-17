import express from "express";
import {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  updatePostStatus,
  toggleLike,
  toggleSave,
  sharePost,
} from "../controllers/postController.js";
import { addComment, getComments } from "../controllers/commentController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getFeed).post(protect, createPost);

router
  .route("/:id")
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.patch("/:id/status", protect, updatePostStatus);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/save", protect, toggleSave);
router.post("/:id/share", protect, sharePost);

router.route("/:id/comments").get(getComments).post(protect, addComment);

export default router;
