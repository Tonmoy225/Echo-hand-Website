import express from "express";
import {
  updateProfile,
  getUserProfile,
  getMyPosts,
  getSavedPosts,
  toggleCart,
  getCart,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.get("/me/posts", protect, getMyPosts);
router.get("/me/saved", protect, getSavedPosts);
router.get("/me/cart", protect, getCart);
router.post("/cart/:postId", protect, toggleCart);
router.get("/:id", getUserProfile);

export default router;
